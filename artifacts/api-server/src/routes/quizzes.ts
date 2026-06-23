import { Router, type IRouter } from "express";
import {
  ListQuizzesResponse,
  GetQuizParams,
  GetQuizResponse,
  SubmitQuizParams,
  SubmitQuizBody,
  SubmitQuizResponse,
} from "@workspace/api-zod";
import { db, quizzesTable, quizQuestionsTable, userQuizAttemptsTable, userActivityTable, usersTable } from "@workspace/db";
import { eq, asc, and, desc, sql } from "drizzle-orm";
import { requireAuth, levelForXp } from "../lib/auth";

const router: IRouter = Router();

router.get("/quizzes", async (req, res): Promise<void> => {
  const quizzes = await db.select().from(quizzesTable).orderBy(asc(quizzesTable.id));

  const questionCounts = await db
    .select({ quizId: quizQuestionsTable.quizId, count: sql<number>`count(*)::int` })
    .from(quizQuestionsTable)
    .groupBy(quizQuestionsTable.quizId);
  const countMap = new Map(questionCounts.map((q) => [q.quizId, q.count]));

  if (!req.user) {
    const result = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      category: q.category,
      difficulty: q.difficulty,
      questionCount: countMap.get(q.id) ?? 0,
      xpReward: q.xpReward,
      estimatedMinutes: q.estimatedMinutes,
      imageUrl: q.imageUrl ?? "",
      isCompleted: false,
      bestScore: null,
    }));
    res.json(ListQuizzesResponse.parse(result));
    return;
  }

  const userId = req.user.id;
  const attempts = await db
    .select()
    .from(userQuizAttemptsTable)
    .where(eq(userQuizAttemptsTable.userId, userId))
    .orderBy(desc(userQuizAttemptsTable.score));

  const bestScoreMap = new Map<number, number>();
  const completedSet = new Set<number>();
  for (const a of attempts) {
    if (a.passed) completedSet.add(a.quizId);
    const cur = bestScoreMap.get(a.quizId);
    if (cur === undefined || a.score > cur) bestScoreMap.set(a.quizId, a.score);
  }

  const result = quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    category: q.category,
    difficulty: q.difficulty,
    questionCount: countMap.get(q.id) ?? 0,
    xpReward: q.xpReward,
    estimatedMinutes: q.estimatedMinutes,
    imageUrl: q.imageUrl ?? "",
    isCompleted: completedSet.has(q.id),
    bestScore: bestScoreMap.get(q.id) ?? null,
  }));

  res.json(ListQuizzesResponse.parse(result));
});

router.get("/quizzes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetQuizParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, params.data.id));
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, quiz.id))
    .orderBy(asc(quizQuestionsTable.order));

  res.json(GetQuizResponse.parse({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    xpReward: quiz.xpReward,
    estimatedMinutes: quiz.estimatedMinutes,
    imageUrl: quiz.imageUrl ?? "",
    questions: questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
    })),
  }));
});

router.post("/quizzes/:id/submit", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = SubmitQuizParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = SubmitQuizBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, params.data.id));
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, quiz.id))
    .orderBy(asc(quizQuestionsTable.order));

  const answers = body.data.answers;
  const results = questions.map((q, i) => ({
    questionId: q.id,
    correct: answers[i] === q.correctIndex,
    correctAnswerIndex: q.correctIndex,
    explanation: q.explanation,
  }));

  const score = results.filter((r) => r.correct).length;
  const total = questions.length;
  const passed = total > 0 && score >= Math.ceil(total * 0.6);

  const u = req.user!;
  const prevBest = await db
    .select({ score: userQuizAttemptsTable.score })
    .from(userQuizAttemptsTable)
    .where(and(eq(userQuizAttemptsTable.userId, u.id), eq(userQuizAttemptsTable.quizId, quiz.id)))
    .orderBy(desc(userQuizAttemptsTable.score))
    .limit(1);

  const isNewBest = prevBest.length === 0 || score > prevBest[0].score;
  const xpEarned = passed && isNewBest ? quiz.xpReward : 0;

  await db.insert(userQuizAttemptsTable).values({
    userId: u.id,
    quizId: quiz.id,
    quizTitle: quiz.title,
    score,
    total,
    xpEarned,
    passed: passed ? 1 : 0,
  });

  if (xpEarned > 0) {
    const [updated] = await db
      .update(usersTable)
      .set({ xp: sql`${usersTable.xp} + ${xpEarned}` })
      .where(eq(usersTable.id, u.id))
      .returning({ newXp: usersTable.xp });

    const newXp = updated?.newXp ?? u.xp + xpEarned;
    const { level } = levelForXp(newXp);

    await Promise.all([
      db.update(usersTable).set({ level }).where(eq(usersTable.id, u.id)),
      db.insert(userActivityTable).values({
        userId: u.id,
        type: "quiz",
        description: `Пройден тест «${quiz.title}» — ${score}/${total}`,
        xpEarned,
      }),
    ]);
  }

  res.json(SubmitQuizResponse.parse({ score, total, xpEarned, passed, results }));
});

export default router;

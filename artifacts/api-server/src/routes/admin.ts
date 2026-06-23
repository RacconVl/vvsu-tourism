import { Router, type IRouter } from "express";
import { db, usersTable, coursesTable, modulesTable, questsTable, quizzesTable, quizQuestionsTable, communityPostsTable, userQuizAttemptsTable, userModuleProgressTable, userQuestSubmissionsTable } from "@workspace/db";
import { sql, eq, gte, desc, asc } from "drizzle-orm";
import {
  AdminListUsersResponse,
  AdminGetStatsResponse,
  AdminCreateCourseBody,
  AdminCreateCourseResponse,
  AdminCreateQuestBody,
  AdminCreateQuestResponse,
  AdminCreateQuizBody,
  AdminCreateQuizResponse,
  AdminUpdateCourseBody,
  AdminUpdateCourseResponse,
  AdminDeleteCourseResponse,
  AdminAddModuleBody,
  AdminAddModuleResponse,
  AdminDeleteModuleResponse,
  AdminUpdateQuestBody,
  AdminUpdateQuestResponse,
  AdminDeleteQuestResponse,
  AdminUpdateQuizBody,
  AdminUpdateQuizResponse,
  AdminDeleteQuizResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.xp));

  const quizCounts = await db
    .select({
      userId: userQuizAttemptsTable.userId,
      count: sql<number>`count(*) filter (where passed = 1)::int`,
    })
    .from(userQuizAttemptsTable)
    .groupBy(userQuizAttemptsTable.userId);
  const quizMap = new Map(quizCounts.map((q) => [q.userId, q.count]));

  const questCounts = await db
    .select({
      userId: userQuestSubmissionsTable.userId,
      count: sql<number>`count(*)::int`,
    })
    .from(userQuestSubmissionsTable)
    .groupBy(userQuestSubmissionsTable.userId);
  const questMap = new Map(questCounts.map((q) => [q.userId, q.count]));

  res.json(AdminListUsersResponse.parse(users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    studentRole: u.studentRole,
    level: u.level,
    xp: u.xp,
    createdAt: u.createdAt.toISOString(),
    completedQuizzes: quizMap.get(u.id) ?? 0,
    completedQuests: questMap.get(u.id) ?? 0,
  }))));
});

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [u] = await db.select({ c: sql<number>`count(*)::int` }).from(usersTable);
  const [a] = await db.select({ c: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "admin"));
  const [c] = await db.select({ c: sql<number>`count(*)::int` }).from(coursesTable);
  const [q] = await db.select({ c: sql<number>`count(*)::int` }).from(questsTable);
  const [qz] = await db.select({ c: sql<number>`count(*)::int` }).from(quizzesTable);
  const [p] = await db.select({ c: sql<number>`count(*)::int` }).from(communityPostsTable);
  const [qa] = await db.select({ c: sql<number>`count(*)::int` }).from(userQuizAttemptsTable).where(gte(userQuizAttemptsTable.createdAt, sevenDaysAgo));
  const [mc] = await db.select({ c: sql<number>`count(*)::int` }).from(userModuleProgressTable).where(gte(userModuleProgressTable.completedAt, sevenDaysAgo));
  res.json(AdminGetStatsResponse.parse({
    totalUsers: u.c,
    totalAdmins: a.c,
    totalCourses: c.c,
    totalQuests: q.c,
    totalQuizzes: qz.c,
    totalCommunityPosts: p.c,
    quizAttemptsLast7d: qa.c,
    moduleCompletionsLast7d: mc.c,
  }));
});

router.post("/admin/courses", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminCreateCourseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [c] = await db.insert(coursesTable).values({
    title: parsed.data.title,
    description: parsed.data.description,
    role: parsed.data.role,
    stage: parsed.data.stage,
    category: parsed.data.category,
    xpReward: parsed.data.xpReward ?? 100,
    imageUrl: parsed.data.imageUrl,
  }).returning();
  res.json(AdminCreateCourseResponse.parse({ ...c, createdAt: c.createdAt.toISOString() }));
});

router.put("/admin/courses/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = AdminUpdateCourseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [c] = await db.update(coursesTable).set({
    title: parsed.data.title,
    description: parsed.data.description,
    role: parsed.data.role,
    stage: parsed.data.stage,
    category: parsed.data.category,
    xpReward: parsed.data.xpReward ?? 100,
    imageUrl: parsed.data.imageUrl,
  }).where(eq(coursesTable.id, id)).returning();
  if (!c) { res.status(404).json({ error: "Course not found" }); return; }
  res.json(AdminUpdateCourseResponse.parse({ ...c, completedModules: c.completedModules, totalModules: c.totalModules }));
});

router.delete("/admin/courses/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(modulesTable).where(eq(modulesTable.courseId, id));
  await db.delete(coursesTable).where(eq(coursesTable.id, id));
  res.json(AdminDeleteCourseResponse.parse({ success: true }));
});

router.post("/admin/courses/:id/modules", requireAdmin, async (req, res): Promise<void> => {
  const courseId = parseInt(req.params.id as string, 10);
  if (isNaN(courseId)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = AdminAddModuleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const existing = await db.select({ order: modulesTable.order }).from(modulesTable).where(eq(modulesTable.courseId, courseId)).orderBy(desc(modulesTable.order));
  const nextOrder = (existing[0]?.order ?? 0) + 1;

  const [m] = await db.insert(modulesTable).values({
    courseId,
    title: parsed.data.title,
    type: parsed.data.type,
    order: nextOrder,
    durationMinutes: parsed.data.durationMinutes,
    xpReward: parsed.data.xpReward,
  }).returning();

  await db.update(coursesTable).set({ totalModules: sql`${coursesTable.totalModules} + 1` }).where(eq(coursesTable.id, courseId));

  res.json(AdminAddModuleResponse.parse({ ...m, isCompleted: false }));
});

router.delete("/admin/modules/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [m] = await db.delete(modulesTable).where(eq(modulesTable.id, id)).returning();
  if (m) {
    await db.update(coursesTable).set({ totalModules: sql`greatest(${coursesTable.totalModules} - 1, 0)` }).where(eq(coursesTable.id, m.courseId));
  }
  res.json(AdminDeleteModuleResponse.parse({ success: true }));
});

router.post("/admin/quests", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminCreateQuestBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [q] = await db.insert(questsTable).values({
    title: parsed.data.title,
    description: parsed.data.description,
    type: parsed.data.type,
    difficulty: parsed.data.difficulty,
    locationName: parsed.data.location,
    xpReward: parsed.data.xpReward ?? 150,
    imageUrl: parsed.data.imageUrl,
  }).returning();
  res.json(AdminCreateQuestResponse.parse({ ...q, createdAt: q.createdAt.toISOString() }));
});

router.put("/admin/quests/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = AdminUpdateQuestBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [q] = await db.update(questsTable).set({
    title: parsed.data.title,
    description: parsed.data.description,
    type: parsed.data.type,
    difficulty: parsed.data.difficulty,
    locationName: parsed.data.location,
    xpReward: parsed.data.xpReward ?? 150,
    imageUrl: parsed.data.imageUrl,
  }).where(eq(questsTable.id, id)).returning();
  if (!q) { res.status(404).json({ error: "Quest not found" }); return; }
  res.json(AdminUpdateQuestResponse.parse({ ...q, isCompleted: false, locationName: q.locationName }));
});

router.delete("/admin/quests/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(questsTable).where(eq(questsTable.id, id));
  res.json(AdminDeleteQuestResponse.parse({ success: true }));
});

router.post("/admin/quizzes", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminCreateQuizBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [quiz] = await db.insert(quizzesTable).values({
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    difficulty: parsed.data.difficulty,
    xpReward: parsed.data.xpReward,
    estimatedMinutes: parsed.data.estimatedMinutes,
    imageUrl: parsed.data.imageUrl,
  }).returning();
  if (parsed.data.questions.length > 0) {
    await db.insert(quizQuestionsTable).values(
      parsed.data.questions.map((q, i) => ({
        quizId: quiz.id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        order: i,
      })),
    );
  }
  res.json(AdminCreateQuizResponse.parse({ id: quiz.id, title: quiz.title, createdAt: quiz.createdAt.toISOString() }));
});

router.put("/admin/quizzes/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = AdminUpdateQuizBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [quiz] = await db.update(quizzesTable).set({
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    difficulty: parsed.data.difficulty,
    xpReward: parsed.data.xpReward,
    estimatedMinutes: parsed.data.estimatedMinutes,
    imageUrl: parsed.data.imageUrl,
  }).where(eq(quizzesTable.id, id)).returning();
  if (!quiz) { res.status(404).json({ error: "Quiz not found" }); return; }
  if (parsed.data.questions.length > 0) {
    await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, id));
    await db.insert(quizQuestionsTable).values(
      parsed.data.questions.map((q, i) => ({
        quizId: id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        order: i,
      })),
    );
  }
  res.json(AdminUpdateQuizResponse.parse({ id: quiz.id, title: quiz.title, createdAt: quiz.createdAt.toISOString() }));
});

router.delete("/admin/quizzes/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, id));
  await db.delete(quizzesTable).where(eq(quizzesTable.id, id));
  res.json(AdminDeleteQuizResponse.parse({ success: true }));
});

export default router;

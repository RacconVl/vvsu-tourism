import { Router, type IRouter } from "express";
import { db, questsTable, userQuestSubmissionsTable, userActivityTable, usersTable } from "@workspace/db";
import { eq, asc, sql } from "drizzle-orm";
import {
  ListQuestsResponse,
  GetQuestParams,
  GetQuestResponse,
  SubmitQuestParams,
  SubmitQuestBody,
  SubmitQuestResponse,
} from "@workspace/api-zod";
import { requireAuth, levelForXp } from "../lib/auth";

const router: IRouter = Router();

router.get("/quests", async (req, res): Promise<void> => {
  const quests = await db.select().from(questsTable).orderBy(asc(questsTable.id));

  if (!req.user) {
    res.json(ListQuestsResponse.parse(quests.map((q) => ({ ...q, isCompleted: false }))));
    return;
  }

  const submissions = await db
    .select({ questId: userQuestSubmissionsTable.questId })
    .from(userQuestSubmissionsTable)
    .where(eq(userQuestSubmissionsTable.userId, req.user.id));

  const completedSet = new Set(submissions.map((s) => s.questId));
  const result = quests.map((q) => ({ ...q, isCompleted: completedSet.has(q.id) }));
  res.json(ListQuestsResponse.parse(result));
});

router.get("/quests/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetQuestParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [quest] = await db.select().from(questsTable).where(eq(questsTable.id, params.data.id));
  if (!quest) {
    res.status(404).json({ error: "Quest not found" });
    return;
  }
  res.json(GetQuestResponse.parse(quest));
});

router.post("/quests/:id/submit", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = SubmitQuestParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = SubmitQuestBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [quest] = await db.select().from(questsTable).where(eq(questsTable.id, params.data.id));
  if (!quest) {
    res.status(404).json({ error: "Quest not found" });
    return;
  }

  const u = req.user!;
  const inserted = await db
    .insert(userQuestSubmissionsTable)
    .values({
      userId: u.id,
      questId: quest.id,
      answer: body.data.answer ?? "",
      status: "submitted",
    })
    .onConflictDoNothing({ target: [userQuestSubmissionsTable.userId, userQuestSubmissionsTable.questId] })
    .returning();

  const isFirst = inserted.length > 0;

  if (isFirst) {
    const [updated] = await db
      .update(usersTable)
      .set({ xp: sql`${usersTable.xp} + ${quest.xpReward}` })
      .where(eq(usersTable.id, u.id))
      .returning({ newXp: usersTable.xp });

    const newXp = updated?.newXp ?? u.xp + quest.xpReward;
    const { level } = levelForXp(newXp);

    await Promise.all([
      db.update(usersTable).set({ level }).where(eq(usersTable.id, u.id)),
      db.insert(userActivityTable).values({
        userId: u.id,
        type: "quest",
        description: `Выполнен квест «${quest.title}»`,
        xpEarned: quest.xpReward,
      }),
    ]);
  }

  res.json(
    SubmitQuestResponse.parse({
      success: true,
      xpEarned: isFirst ? quest.xpReward : 0,
      feedback: isFirst
        ? "Отлично! Задание принято и записано в вашем профиле."
        : "Вы уже сдавали этот квест ранее. Повторная отправка не приносит XP.",
      newAchievements: [],
    }),
  );
});

export default router;

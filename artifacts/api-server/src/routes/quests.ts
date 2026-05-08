import { Router, type IRouter } from "express";
import { db, questsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListQuestsResponse,
  GetQuestParams,
  GetQuestResponse,
  SubmitQuestParams,
  SubmitQuestBody,
  SubmitQuestResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/quests", async (_req, res): Promise<void> => {
  const quests = await db.select().from(questsTable).orderBy(asc(questsTable.id));
  res.json(ListQuestsResponse.parse(quests));
});

router.get("/quests/:id", async (req, res): Promise<void> => {
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

router.post("/quests/:id/submit", async (req, res): Promise<void> => {
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

  await db.update(questsTable).set({ isCompleted: true }).where(eq(questsTable.id, params.data.id));

  res.json(SubmitQuestResponse.parse({
    success: true,
    xpEarned: quest.xpReward,
    feedback: "Отлично! Задание выполнено успешно. Вы продвинулись на пути к мастерству туристического специалиста.",
    newAchievements: [],
  }));
});

export default router;

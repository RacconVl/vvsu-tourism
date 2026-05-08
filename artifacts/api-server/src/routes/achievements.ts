import { Router, type IRouter } from "express";
import { db, achievementsTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { ListAchievementsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/achievements", async (_req, res): Promise<void> => {
  const achievements = await db.select().from(achievementsTable).orderBy(asc(achievementsTable.id));
  res.json(ListAchievementsResponse.parse(achievements.map(a => ({
    ...a,
    unlockedAt: a.unlockedAt ? a.unlockedAt.toISOString() : null,
  }))));
});

export default router;

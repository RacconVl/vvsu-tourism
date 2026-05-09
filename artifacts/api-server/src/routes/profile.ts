import { Router, type IRouter } from "express";
import { db, usersTable, userActivityTable, userQuizAttemptsTable, userQuestSubmissionsTable, userModuleProgressTable, userAchievementsTable, achievementsTable, coursesTable } from "@workspace/db";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  GetMyProfileResponse,
  UpdateMyProfileBody,
  UpdateMyProfileResponse,
  GetPublicProfileResponse,
} from "@workspace/api-zod";
import { publicUser, requireAuth, levelForXp } from "../lib/auth";

const router: IRouter = Router();

async function buildProfile(userId: number) {
  const [u] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!u) return null;

  const lv = levelForXp(u.xp);
  if (u.level !== lv.level) {
    await db.update(usersTable).set({ level: lv.level }).where(eq(usersTable.id, u.id));
    u.level = lv.level;
  }

  const [{ count: quizCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(userQuizAttemptsTable)
    .where(and(eq(userQuizAttemptsTable.userId, userId), eq(userQuizAttemptsTable.passed, 1)));

  const [{ count: questCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(userQuestSubmissionsTable)
    .where(eq(userQuestSubmissionsTable.userId, userId));

  const [{ count: moduleCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(userModuleProgressTable)
    .where(eq(userModuleProgressTable.userId, userId));

  const activities = await db
    .select()
    .from(userActivityTable)
    .where(eq(userActivityTable.userId, userId))
    .orderBy(desc(userActivityTable.createdAt))
    .limit(15);

  const attempts = await db
    .select()
    .from(userQuizAttemptsTable)
    .where(eq(userQuizAttemptsTable.userId, userId))
    .orderBy(desc(userQuizAttemptsTable.createdAt))
    .limit(15);

  const unlocked = await db
    .select({
      id: achievementsTable.id,
      name: achievementsTable.title,
      description: achievementsTable.description,
      iconType: achievementsTable.icon,
      category: achievementsTable.category,
      xpReward: achievementsTable.xpValue,
      unlockedAt: userAchievementsTable.unlockedAt,
    })
    .from(userAchievementsTable)
    .innerJoin(achievementsTable, eq(achievementsTable.id, userAchievementsTable.achievementId))
    .where(eq(userAchievementsTable.userId, userId));

  const courseRows = await db
    .select({
      courseId: userModuleProgressTable.courseId,
      completed: sql<number>`count(*)::int`,
    })
    .from(userModuleProgressTable)
    .where(eq(userModuleProgressTable.userId, userId))
    .groupBy(userModuleProgressTable.courseId);

  const allCourses = await db.select().from(coursesTable);
  const courseMap = new Map(allCourses.map((c) => [c.id, c]));
  const completedCourses = courseRows.flatMap((r) => {
    const c = courseMap.get(r.courseId);
    if (!c) return [];
    return [{
      courseId: c.id,
      title: c.title,
      completedModules: r.completed,
      totalModules: c.totalModules,
    }];
  });

  return {
    user: publicUser(u),
    nextLevelXp: lv.nextLevelXp,
    currentLevelXp: lv.currentLevelXp,
    completedQuests: questCount,
    completedQuizzes: quizCount,
    completedModules: moduleCount,
    unlockedAchievements: unlocked.map((a) => ({ ...a, unlockedAt: a.unlockedAt.toISOString() })),
    recentActivity: activities.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      xpEarned: a.xpEarned,
      createdAt: a.createdAt.toISOString(),
    })),
    quizHistory: attempts.map((a) => ({
      id: a.id,
      quizId: a.quizId,
      quizTitle: a.quizTitle,
      score: a.score,
      total: a.total,
      xpEarned: a.xpEarned,
      passed: a.passed === 1,
      createdAt: a.createdAt.toISOString(),
    })),
    completedCourses,
  };
}

router.get("/profile", requireAuth, async (req, res): Promise<void> => {
  const p = await buildProfile(req.user!.id);
  res.json(GetMyProfileResponse.parse(p));
});

router.patch("/profile", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateMyProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const update: Record<string, string> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.bio !== undefined) update.bio = data.bio;
  if (data.avatarUrl !== undefined) update.avatarUrl = data.avatarUrl;
  if (data.studentRole !== undefined) update.studentRole = data.studentRole;
  const [u] = await db.update(usersTable).set(update).where(eq(usersTable.id, req.user!.id)).returning();
  res.json(UpdateMyProfileResponse.parse(publicUser(u)));
});

router.get("/profile/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const p = await buildProfile(id);
  if (!p) {
    res.status(404).json({ error: "Пользователь не найден" });
    return;
  }
  const pub = {
    user: {
      id: p.user.id,
      name: p.user.name,
      role: p.user.role,
      studentRole: p.user.studentRole,
      bio: p.user.bio,
      avatarUrl: p.user.avatarUrl,
      level: p.user.level,
      xp: p.user.xp,
    },
    completedQuests: p.completedQuests,
    completedQuizzes: p.completedQuizzes,
    completedModules: p.completedModules,
    unlockedAchievements: p.unlockedAchievements,
  };
  res.json(GetPublicProfileResponse.parse(pub));
});

export default router;

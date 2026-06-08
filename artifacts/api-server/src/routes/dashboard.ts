import { Router, type IRouter } from "express";
import {
  db,
  coursesTable,
  modulesTable,
  questsTable,
  achievementsTable,
  usersTable,
  userQuestSubmissionsTable,
  userModuleProgressTable,
  userActivityTable,
  userAchievementsTable,
} from "@workspace/db";
import { desc, eq, ne, sql } from "drizzle-orm";
import {
  GetDashboardSummaryResponse,
  GetProgressMapResponse,
  GetLeaderboardResponse,
} from "@workspace/api-zod";
import { requireAuth, levelForXp } from "../lib/auth";

const router: IRouter = Router();

router.get("/dashboard/summary", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.id;
  const u = req.user!;

  const [courses, quests, achievements, allModules, userProgress, userQuestSubs, unlockedRows, activityRows] =
    await Promise.all([
      db.select().from(coursesTable),
      db.select().from(questsTable),
      db.select().from(achievementsTable),
      db.select({ id: modulesTable.id, courseId: modulesTable.courseId }).from(modulesTable),
      db
        .select({ moduleId: userModuleProgressTable.moduleId })
        .from(userModuleProgressTable)
        .where(eq(userModuleProgressTable.userId, userId)),
      db
        .select({ questId: userQuestSubmissionsTable.questId })
        .from(userQuestSubmissionsTable)
        .where(eq(userQuestSubmissionsTable.userId, userId)),
      db.select().from(userAchievementsTable).where(eq(userAchievementsTable.userId, userId)),
      db
        .select()
        .from(userActivityTable)
        .where(eq(userActivityTable.userId, userId))
        .orderBy(desc(userActivityTable.createdAt))
        .limit(5),
    ]);

  const completedModuleIds = new Set(userProgress.map((p) => p.moduleId));
  const modulesPerCourse = new Map<number, number[]>();
  for (const m of allModules) {
    const arr = modulesPerCourse.get(m.courseId) ?? [];
    arr.push(m.id);
    modulesPerCourse.set(m.courseId, arr);
  }
  let completedCourses = 0;
  for (const course of courses) {
    const mIds = modulesPerCourse.get(course.id) ?? [];
    if (mIds.length > 0 && mIds.every((id) => completedModuleIds.has(id))) completedCourses++;
  }
  const completedQuests = userQuestSubs.length;

  const unlockedAchievements = unlockedRows.length;
  const lv = levelForXp(u.xp);

  const recentActivity = activityRows.map((a) => ({
    id: a.id,
    type: a.type,
    description: a.description,
    xpEarned: a.xpEarned,
    timestamp: a.createdAt.toISOString(),
  }));

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Финальный тест модуля",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      courseTitle: "Туристический маркетинг",
      type: "test",
    },
    {
      id: 2,
      title: "Практическое задание: бюджет тура",
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      courseTitle: "Туроперейтинг",
      type: "quest",
    },
  ];

  const currentStages = [
    "Порт отправления",
    "Бухта открытий",
    "Мост знаний",
    "Остров мастерства",
    "Тихоокеанский горизонт",
  ];
  const stageIndex = Math.min(Math.floor(u.xp / 500), 4);

  const summary = {
    studentName: u.name,
    currentRole: u.studentRole,
    level: u.level,
    xp: u.xp,
    xpToNextLevel: lv.nextLevelXp,
    currentStage: currentStages[stageIndex],
    completedCourses,
    totalCourses: courses.length,
    completedQuests,
    totalQuests: quests.length,
    unlockedAchievements,
    totalAchievements: achievements.length,
    recentActivity,
    upcomingDeadlines,
  };

  res.json(GetDashboardSummaryResponse.parse(summary));
});

router.get("/dashboard/progress", async (_req, res): Promise<void> => {
  const stages = [
    { id: 1, name: "Порт отправления", location: "Владивостокский морской вокзал", isCompleted: true, isCurrent: false, isLocked: false, xpRequired: 0, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400" },
    { id: 2, name: "Бухта открытий", location: "Бухта Золотой Рог", isCompleted: false, isCurrent: true, isLocked: false, xpRequired: 200, imageUrl: "https://images.unsplash.com/photo-1569834382869-9d0e90b24e4d?w=400" },
    { id: 3, name: "Мост знаний", location: "Золотой мост", isCompleted: false, isCurrent: false, isLocked: true, xpRequired: 500, imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400" },
    { id: 4, name: "Остров мастерства", location: "Остров Русский", isCompleted: false, isCurrent: false, isLocked: true, xpRequired: 1000, imageUrl: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400" },
    { id: 5, name: "Тихоокеанский горизонт", location: "Мыс Тобизина", isCompleted: false, isCurrent: false, isLocked: true, xpRequired: 2000, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
  ];

  res.json(GetProgressMapResponse.parse({ stages, currentStageIndex: 1 }));
});

router.get("/dashboard/leaderboard", async (_req, res): Promise<void> => {
  const users = await db
    .select()
    .from(usersTable)
    .where(ne(usersTable.role, "admin"))
    .orderBy(desc(usersTable.xp))
    .limit(20);

  const counts = await db
    .select({
      userId: userQuestSubmissionsTable.userId,
      count: sql<number>`count(*)::int`,
    })
    .from(userQuestSubmissionsTable)
    .groupBy(userQuestSubmissionsTable.userId);

  const countMap = new Map(counts.map((c) => [c.userId, c.count]));
  const leaderboard = users.map((u, i) => ({
    rank: i + 1,
    studentName: u.name,
    level: u.level,
    xp: u.xp,
    role: u.studentRole,
    avatarUrl:
      u.avatarUrl ??
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`,
    completedQuests: countMap.get(u.id) ?? 0,
  }));

  res.json(GetLeaderboardResponse.parse(leaderboard));
});

export default router;

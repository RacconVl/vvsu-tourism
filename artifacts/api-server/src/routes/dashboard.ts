import { Router, type IRouter } from "express";
import { db, coursesTable, questsTable, achievementsTable, communityPostsTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetProgressMapResponse,
  GetLeaderboardResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable);
  const quests = await db.select().from(questsTable);
  const achievements = await db.select().from(achievementsTable);

  const completedCourses = courses.filter(c => c.completedModules >= c.totalModules && c.totalModules > 0).length;
  const completedQuests = quests.filter(q => q.isCompleted).length;
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  const xp = completedCourses * 200 + completedQuests * 150 + unlockedAchievements * 50;
  const level = Math.floor(xp / 500) + 1;
  const xpToNextLevel = (level * 500) - xp;

  const recentActivity = [
    { id: 1, type: "module_complete", description: "Завершён модуль: Основы туристического маршрута", xpEarned: 25, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, type: "quest_complete", description: "Выполнен квест: Разработка маршрута по Золотому рогу", xpEarned: 150, timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, type: "achievement", description: "Получен значок: Первооткрыватель", xpEarned: 50, timestamp: new Date(Date.now() - 172800000).toISOString() },
  ];

  const upcomingDeadlines = [
    { id: 1, title: "Финальный тест модуля", dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), courseTitle: "Туристический маркетинг", type: "test" },
    { id: 2, title: "Практическое задание: бюджет тура", dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), courseTitle: "Туроперейтинг", type: "quest" },
  ];

  const summary = {
    studentName: "Александра Морозова",
    currentRole: "guide",
    level,
    xp,
    xpToNextLevel,
    currentStage: "Бухта открытий",
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
  const leaderboard = [
    { rank: 1, studentName: "Дмитрий Волков", level: 8, xp: 3850, role: "marketer", avatarUrl: "https://i.pravatar.cc/150?img=1", completedQuests: 12 },
    { rank: 2, studentName: "Анна Сизова", level: 7, xp: 3200, role: "designer", avatarUrl: "https://i.pravatar.cc/150?img=5", completedQuests: 10 },
    { rank: 3, studentName: "Максим Тихонов", level: 6, xp: 2900, role: "operator", avatarUrl: "https://i.pravatar.cc/150?img=3", completedQuests: 9 },
    { rank: 4, studentName: "Александра Морозова", level: 5, xp: 2400, role: "guide", avatarUrl: "https://i.pravatar.cc/150?img=9", completedQuests: 7 },
    { rank: 5, studentName: "Иван Петров", level: 4, xp: 1950, role: "guide", avatarUrl: "https://i.pravatar.cc/150?img=7", completedQuests: 6 },
    { rank: 6, studentName: "Елена Краснова", level: 4, xp: 1800, role: "marketer", avatarUrl: "https://i.pravatar.cc/150?img=10", completedQuests: 5 },
    { rank: 7, studentName: "Сергей Борисов", level: 3, xp: 1400, role: "designer", avatarUrl: "https://i.pravatar.cc/150?img=12", completedQuests: 4 },
    { rank: 8, studentName: "Мария Фёдорова", level: 3, xp: 1200, role: "operator", avatarUrl: "https://i.pravatar.cc/150?img=15", completedQuests: 3 },
  ];

  res.json(GetLeaderboardResponse.parse(leaderboard));
});

export default router;

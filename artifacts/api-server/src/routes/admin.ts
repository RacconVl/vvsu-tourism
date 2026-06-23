import { Router, type IRouter } from "express";
import { db, usersTable, coursesTable, questsTable, communityPostsTable, userQuizAttemptsTable, userModuleProgressTable, userQuestSubmissionsTable, achievementsTable } from "@workspace/db";
import { sql, eq, gte, desc } from "drizzle-orm";
import {
  AdminListUsersResponse,
  AdminGetStatsResponse,
  AdminCreateCourseBody,
  AdminCreateCourseResponse,
  AdminCreateQuestBody,
  AdminCreateQuestResponse,
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
  const [p] = await db.select({ c: sql<number>`count(*)::int` }).from(communityPostsTable);
  const [qa] = await db.select({ c: sql<number>`count(*)::int` }).from(userQuizAttemptsTable).where(gte(userQuizAttemptsTable.createdAt, sevenDaysAgo));
  const [mc] = await db.select({ c: sql<number>`count(*)::int` }).from(userModuleProgressTable).where(gte(userModuleProgressTable.completedAt, sevenDaysAgo));
  res.json(AdminGetStatsResponse.parse({
    totalUsers: u.c,
    totalAdmins: a.c,
    totalCourses: c.c,
    totalQuests: q.c,
    totalQuizzes: 5,
    totalCommunityPosts: p.c,
    quizAttemptsLast7d: qa.c,
    moduleCompletionsLast7d: mc.c,
  }));
});

router.post("/admin/courses", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminCreateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
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

router.post("/admin/quests", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminCreateQuestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
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

export default router;

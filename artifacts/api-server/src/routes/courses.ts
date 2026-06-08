import { Router, type IRouter } from "express";
import {
  db,
  coursesTable,
  modulesTable,
  userModuleProgressTable,
  userActivityTable,
  usersTable,
} from "@workspace/db";
import { eq, asc, and, sql } from "drizzle-orm";
import {
  ListCoursesResponse,
  GetCourseParams,
  GetCourseResponse,
  CompleteModuleParams,
  CompleteModuleResponse,
} from "@workspace/api-zod";
import { requireAuth, levelForXp } from "../lib/auth";

const router: IRouter = Router();

router.get("/courses", async (req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable).orderBy(asc(coursesTable.id));

  if (!req.user) {
    res.json(ListCoursesResponse.parse(courses));
    return;
  }

  const userId = req.user.id;
  const [allModules, progress] = await Promise.all([
    db.select({ id: modulesTable.id, courseId: modulesTable.courseId }).from(modulesTable),
    db
      .select({ moduleId: userModuleProgressTable.moduleId })
      .from(userModuleProgressTable)
      .where(eq(userModuleProgressTable.userId, userId)),
  ]);

  const completedSet = new Set(progress.map((p) => p.moduleId));
  const modulesPerCourse = new Map<number, number[]>();
  for (const m of allModules) {
    const arr = modulesPerCourse.get(m.courseId) ?? [];
    arr.push(m.id);
    modulesPerCourse.set(m.courseId, arr);
  }

  const result = courses.map((c) => {
    const mIds = modulesPerCourse.get(c.id) ?? [];
    const completedModules = mIds.filter((id) => completedSet.has(id)).length;
    return { ...c, completedModules, totalModules: mIds.length || c.totalModules };
  });

  res.json(ListCoursesResponse.parse(result));
});

router.get("/courses/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetCourseParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, params.data.id));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const modules = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.courseId, params.data.id))
    .orderBy(asc(modulesTable.order));

  let completedSet = new Set<number>();
  if (req.user) {
    const progress = await db
      .select({ moduleId: userModuleProgressTable.moduleId })
      .from(userModuleProgressTable)
      .where(
        and(
          eq(userModuleProgressTable.userId, req.user.id),
          eq(userModuleProgressTable.courseId, params.data.id),
        ),
      );
    completedSet = new Set(progress.map((p) => p.moduleId));
  }

  const modulesWithCompletion = modules.map((m) => ({ ...m, isCompleted: completedSet.has(m.id) }));
  const completedCount = modulesWithCompletion.filter((m) => m.isCompleted).length;

  res.json(
    GetCourseResponse.parse({
      ...course,
      completedModules: completedCount,
      totalModules: modules.length || course.totalModules,
      modules: modulesWithCompletion,
    }),
  );
});

router.post("/modules/:id/complete", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CompleteModuleParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [module] = await db.select().from(modulesTable).where(eq(modulesTable.id, params.data.id));
  if (!module) {
    res.status(404).json({ error: "Module not found" });
    return;
  }

  const u = req.user!;

  const inserted = await db
    .insert(userModuleProgressTable)
    .values({ userId: u.id, moduleId: module.id, courseId: module.courseId })
    .onConflictDoNothing()
    .returning();

  const isFirst = inserted.length > 0;

  if (isFirst) {
    const [updated] = await db
      .update(usersTable)
      .set({ xp: sql`${usersTable.xp} + ${module.xpReward}` })
      .where(eq(usersTable.id, u.id))
      .returning({ newXp: usersTable.xp });

    const newXp = updated?.newXp ?? u.xp + module.xpReward;
    const { level } = levelForXp(newXp);

    await Promise.all([
      db.update(usersTable).set({ level }).where(eq(usersTable.id, u.id)),
      db.insert(userActivityTable).values({
        userId: u.id,
        type: "module_complete",
        description: `Пройден модуль «${module.title}»`,
        xpEarned: module.xpReward,
      }),
    ]);
  }

  res.json(CompleteModuleResponse.parse({ success: true, xpEarned: isFirst ? module.xpReward : 0, newAchievements: [] }));
});

export default router;

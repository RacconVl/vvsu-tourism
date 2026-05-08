import { Router, type IRouter } from "express";
import { db, coursesTable, modulesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListCoursesResponse,
  GetCourseParams,
  GetCourseResponse,
  CompleteModuleParams,
  CompleteModuleResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/courses", async (_req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable).orderBy(asc(coursesTable.id));
  res.json(ListCoursesResponse.parse(courses));
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

  res.json(GetCourseResponse.parse({ ...course, modules }));
});

router.post("/modules/:id/complete", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CompleteModuleParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [module] = await db
    .update(modulesTable)
    .set({ isCompleted: true })
    .where(eq(modulesTable.id, params.data.id))
    .returning();

  if (!module) {
    res.status(404).json({ error: "Module not found" });
    return;
  }

  res.json(CompleteModuleResponse.parse({ success: true, xpEarned: module.xpReward, newAchievements: [] }));
});

export default router;

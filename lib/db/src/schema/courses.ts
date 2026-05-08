import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  role: text("role").notNull(),
  stage: text("stage").notNull(),
  imageUrl: text("image_url"),
  totalModules: integer("total_modules").notNull().default(0),
  completedModules: integer("completed_modules").notNull().default(0),
  xpReward: integer("xp_reward").notNull().default(100),
  isLocked: boolean("is_locked").notNull().default(false),
  category: text("category").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id),
  title: text("title").notNull(),
  type: text("type").notNull(),
  order: integer("order").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  durationMinutes: integer("duration_minutes").notNull().default(15),
  xpReward: integer("xp_reward").notNull().default(25),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modulesTable).omit({ id: true, createdAt: true });
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modulesTable.$inferSelect;

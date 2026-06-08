import { pgTable, text, serial, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"),
  studentRole: text("student_role").notNull().default("guide"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  emailIdx: uniqueIndex("users_email_idx").on(t.email),
}));

export type User = typeof usersTable.$inferSelect;
export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

export const userActivityTable = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  description: text("description").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type UserActivity = typeof userActivityTable.$inferSelect;

export const userModuleProgressTable = pgTable("user_module_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  moduleId: integer("module_id").notNull(),
  courseId: integer("course_id").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userModuleUnique: uniqueIndex("user_module_progress_user_module_idx").on(t.userId, t.moduleId),
}));
export type UserModuleProgress = typeof userModuleProgressTable.$inferSelect;

export const userQuestSubmissionsTable = pgTable("user_quest_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  questId: integer("quest_id").notNull(),
  answer: text("answer").notNull(),
  status: text("status").notNull().default("submitted"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userQuestUnique: uniqueIndex("user_quest_submissions_user_quest_idx").on(t.userId, t.questId),
}));
export type UserQuestSubmission = typeof userQuestSubmissionsTable.$inferSelect;

export const userQuizAttemptsTable = pgTable("user_quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  quizId: integer("quiz_id").notNull(),
  quizTitle: text("quiz_title").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  passed: integer("passed").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type UserQuizAttempt = typeof userQuizAttemptsTable.$inferSelect;

export const userAchievementsTable = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull().defaultNow(),
});
export type UserAchievement = typeof userAchievementsTable.$inferSelect;

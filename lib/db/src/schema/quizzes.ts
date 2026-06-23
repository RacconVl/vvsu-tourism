import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  difficulty: text("difficulty").notNull().default("medium"),
  xpReward: integer("xp_reward").notNull().default(150),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation").notNull().default(""),
  order: integer("order").notNull().default(0),
});

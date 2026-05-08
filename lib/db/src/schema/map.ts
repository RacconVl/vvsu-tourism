import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mapPointsTable = pgTable("map_points", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  relatedCourseId: integer("related_course_id"),
  legend: text("legend"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMapPointSchema = createInsertSchema(mapPointsTable).omit({ id: true, createdAt: true });
export type InsertMapPoint = z.infer<typeof insertMapPointSchema>;
export type MapPoint = typeof mapPointsTable.$inferSelect;

export const touristRoutesTable = pgTable("tourist_routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  durationHours: real("duration_hours").notNull(),
  pointIds: text("point_ids").array().notNull().default([]),
  difficulty: text("difficulty").notNull(),
  authorName: text("author_name").notNull(),
  isStudentCreated: boolean("is_student_created").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTouristRouteSchema = createInsertSchema(touristRoutesTable).omit({ id: true, createdAt: true });
export type InsertTouristRoute = z.infer<typeof insertTouristRouteSchema>;
export type TouristRoute = typeof touristRoutesTable.$inferSelect;

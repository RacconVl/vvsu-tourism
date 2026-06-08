import { pgTable, serial, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const friendshipsTable = pgTable("friendships", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  addresseeId: integer("addressee_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  pairIdx: uniqueIndex("friendships_pair_idx").on(t.requesterId, t.addresseeId),
}));

export type Friendship = typeof friendshipsTable.$inferSelect;

import { Router, type IRouter } from "express";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { eq, desc, and, inArray, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth";

const router: IRouter = Router();

export async function createNotification(opts: {
  userId: number;
  senderId?: number;
  type: string;
  title: string;
  body: string;
  link?: string;
}) {
  await db.insert(notificationsTable).values({
    userId: opts.userId,
    senderId: opts.senderId ?? null,
    type: opts.type,
    title: opts.title,
    body: opts.body,
    link: opts.link ?? null,
    isRead: false,
  });
}

// GET /notifications — latest 50 for current user, newest first
router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;

  const rows = await db
    .select({
      id: notificationsTable.id,
      type: notificationsTable.type,
      title: notificationsTable.title,
      body: notificationsTable.body,
      link: notificationsTable.link,
      isRead: notificationsTable.isRead,
      createdAt: notificationsTable.createdAt,
      senderId: notificationsTable.senderId,
      senderName: usersTable.name,
      senderStudentRole: usersTable.studentRole,
      senderLevel: usersTable.level,
      senderAvatarUrl: usersTable.avatarUrl,
    })
    .from(notificationsTable)
    .leftJoin(usersTable, eq(notificationsTable.senderId, usersTable.id))
    .where(eq(notificationsTable.userId, myId))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);

  res.json(rows.map(r => ({
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body,
    link: r.link ?? null,
    isRead: r.isRead,
    createdAt: r.createdAt.toISOString(),
    sender: r.senderId ? {
      id: r.senderId,
      name: r.senderName!,
      studentRole: r.senderStudentRole!,
      level: r.senderLevel!,
      avatarUrl: r.senderAvatarUrl ?? null,
      isOnline: false,
    } : null,
  })));
});

// PATCH /notifications/read-all
router.patch("/notifications/read-all", requireAuth, async (req, res): Promise<void> => {
  await db
    .update(notificationsTable)
    .set({ isRead: true })
    .where(and(eq(notificationsTable.userId, req.user!.id), eq(notificationsTable.isRead, false)));
  res.status(204).end();
});

// PATCH /notifications/:id/read
router.patch("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db
    .update(notificationsTable)
    .set({ isRead: true })
    .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, req.user!.id)));
  res.status(204).end();
});

// POST /notifications/admin — admin broadcast
router.post("/notifications/admin", requireAdmin, async (req, res): Promise<void> => {
  const { userIds, type, title, body, link } = req.body as {
    userIds?: number[] | null;
    type: string;
    title: string;
    body: string;
    link?: string;
  };
  if (!type || !title || !body) { res.status(400).json({ error: "type, title, body required" }); return; }

  let targetIds: number[];
  if (!userIds || userIds.length === 0) {
    // broadcast to all non-admin users
    const users = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(sql`${usersTable.role} != 'admin'`);
    targetIds = users.map(u => u.id);
  } else {
    targetIds = userIds;
  }

  if (targetIds.length === 0) {
    res.status(201).json({ count: 0 });
    return;
  }

  await db.insert(notificationsTable).values(
    targetIds.map(uid => ({
      userId: uid,
      senderId: req.user!.id,
      type,
      title,
      body,
      link: link ?? null,
      isRead: false,
    }))
  );

  res.status(201).json({ count: targetIds.length });
});

export default router;

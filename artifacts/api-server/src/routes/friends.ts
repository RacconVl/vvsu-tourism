import { Router, type IRouter } from "express";
import { db, usersTable, friendshipsTable } from "@workspace/db";
import { eq, and, or, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { createNotification } from "./notifications";

const router: IRouter = Router();

const ONLINE_THRESHOLD_MS = 90_000; // 90 seconds

function isOnline(lastSeenAt: Date | null): boolean {
  if (!lastSeenAt) return false;
  return Date.now() - lastSeenAt.getTime() < ONLINE_THRESHOLD_MS;
}

async function getFriendshipRow(myId: number, otherId: number) {
  const [row] = await db
    .select()
    .from(friendshipsTable)
    .where(or(
      and(eq(friendshipsTable.requesterId, myId), eq(friendshipsTable.addresseeId, otherId)),
      and(eq(friendshipsTable.requesterId, otherId), eq(friendshipsTable.addresseeId, myId)),
    ))
    .limit(1);
  return row ?? null;
}

function friendStatus(row: typeof friendshipsTable.$inferSelect | null, myId: number): string {
  if (!row) return "none";
  if (row.status === "accepted") return "friends";
  if (row.status === "pending") {
    return row.requesterId === myId ? "pending_sent" : "pending_received";
  }
  return "none";
}

// List accepted friends
router.get("/friends", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;

  const rows = await db
    .select()
    .from(friendshipsTable)
    .where(and(
      or(eq(friendshipsTable.requesterId, myId), eq(friendshipsTable.addresseeId, myId)),
      eq(friendshipsTable.status, "accepted"),
    ));

  if (rows.length === 0) { res.json([]); return; }

  const partnerIds = rows.map(r => r.requesterId === myId ? r.addresseeId : r.requesterId);
  const users = await db
    .select({ id: usersTable.id, name: usersTable.name, studentRole: usersTable.studentRole, level: usersTable.level, avatarUrl: usersTable.avatarUrl, lastSeenAt: usersTable.lastSeenAt })
    .from(usersTable)
    .where(sql`${usersTable.id} = ANY(ARRAY[${sql.join(partnerIds.map(id => sql`${id}`), sql`, `)}]::int[])`);

  res.json(users.map(u => ({
    id: u.id,
    name: u.name,
    studentRole: u.studentRole,
    level: u.level,
    avatarUrl: u.avatarUrl ?? null,
    isOnline: isOnline(u.lastSeenAt),
  })));
});

// List incoming pending friend requests
router.get("/friends/requests", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;

  const rows = await db
    .select()
    .from(friendshipsTable)
    .where(and(
      eq(friendshipsTable.addresseeId, myId),
      eq(friendshipsTable.status, "pending"),
    ));

  if (rows.length === 0) { res.json([]); return; }

  const requesterIds = rows.map(r => r.requesterId);
  const users = await db
    .select({ id: usersTable.id, name: usersTable.name, studentRole: usersTable.studentRole, level: usersTable.level, avatarUrl: usersTable.avatarUrl, lastSeenAt: usersTable.lastSeenAt })
    .from(usersTable)
    .where(sql`${usersTable.id} = ANY(ARRAY[${sql.join(requesterIds.map(id => sql`${id}`), sql`, `)}]::int[])`);

  const userMap = new Map(users.map(u => [u.id, u]));

  res.json(rows.map(r => {
    const u = userMap.get(r.requesterId)!;
    return {
      id: r.id,
      requester: {
        id: u.id,
        name: u.name,
        studentRole: u.studentRole,
        level: u.level,
        avatarUrl: u.avatarUrl ?? null,
        isOnline: isOnline(u.lastSeenAt),
      },
      createdAt: r.createdAt.toISOString(),
    };
  }));
});

// Get friend + online status with a specific user
router.get("/friends/status/:userId", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const otherId = parseInt(req.params.userId as string, 10);
  if (isNaN(otherId)) { res.status(400).json({ error: "Invalid userId" }); return; }

  const [other] = await db.select({ lastSeenAt: usersTable.lastSeenAt }).from(usersTable).where(eq(usersTable.id, otherId)).limit(1);
  if (!other) { res.status(404).json({ error: "User not found" }); return; }

  const row = await getFriendshipRow(myId, otherId);
  res.json({ isOnline: isOnline(other.lastSeenAt), status: friendStatus(row, myId) });
});

// Send friend request
router.post("/friends/:userId", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const otherId = parseInt(req.params.userId as string, 10);
  if (isNaN(otherId) || otherId === myId) { res.status(400).json({ error: "Invalid userId" }); return; }

  const existing = await getFriendshipRow(myId, otherId);
  if (existing) { res.status(409).json({ error: "Request already exists" }); return; }

  await db.insert(friendshipsTable).values({ requesterId: myId, addresseeId: otherId, status: "pending" });

  const [me] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, myId)).limit(1);
  const [other] = await db.select({ lastSeenAt: usersTable.lastSeenAt }).from(usersTable).where(eq(usersTable.id, otherId)).limit(1);

  createNotification({
    userId: otherId,
    senderId: myId,
    type: "friend_request",
    title: "Новый запрос в друзья",
    body: `${me?.name ?? "Студент"} хочет добавить вас в друзья`,
    link: "/cabinet/friends",
  }).catch(() => {});

  res.status(201).json({ isOnline: isOnline(other?.lastSeenAt ?? null), status: "pending_sent" });
});

// Accept friend request
router.patch("/friends/:userId/accept", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const requesterId = parseInt(req.params.userId as string, 10);
  if (isNaN(requesterId)) { res.status(400).json({ error: "Invalid userId" }); return; }

  await db.update(friendshipsTable)
    .set({ status: "accepted" })
    .where(and(
      eq(friendshipsTable.requesterId, requesterId),
      eq(friendshipsTable.addresseeId, myId),
      eq(friendshipsTable.status, "pending"),
    ));

  const [me] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, myId)).limit(1);
  createNotification({
    userId: requesterId,
    senderId: myId,
    type: "friend_request",
    title: "Запрос в друзья принят",
    body: `${me?.name ?? "Студент"} принял(а) ваш запрос в друзья`,
    link: "/cabinet/friends",
  }).catch(() => {});

  res.status(204).end();
});

// Remove friend / cancel / decline
router.delete("/friends/:userId", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const otherId = parseInt(req.params.userId as string, 10);
  if (isNaN(otherId)) { res.status(400).json({ error: "Invalid userId" }); return; }

  await db.delete(friendshipsTable).where(or(
    and(eq(friendshipsTable.requesterId, myId), eq(friendshipsTable.addresseeId, otherId)),
    and(eq(friendshipsTable.requesterId, otherId), eq(friendshipsTable.addresseeId, myId)),
  ));

  res.status(204).end();
});

export default router;

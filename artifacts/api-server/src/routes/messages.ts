import { Router, type IRouter } from "express";
import { db, messagesTable, usersTable } from "@workspace/db";
import { desc, asc, eq, or, and, ne, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.get("/users", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const users = await db
    .select({ id: usersTable.id, name: usersTable.name, studentRole: usersTable.studentRole, level: usersTable.level, avatarUrl: usersTable.avatarUrl })
    .from(usersTable)
    .where(ne(usersTable.id, myId))
    .orderBy(usersTable.name);
  res.json(users);
});

router.get("/messages/conversations", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;

  const partnerRows = await db
    .selectDistinct({
      partnerId: sql<number>`CASE WHEN ${messagesTable.senderId} = ${myId} THEN ${messagesTable.receiverId} ELSE ${messagesTable.senderId} END`,
    })
    .from(messagesTable)
    .where(or(eq(messagesTable.senderId, myId), eq(messagesTable.receiverId, myId)));

  if (partnerRows.length === 0) {
    res.json([]);
    return;
  }

  const conversations = await Promise.all(
    partnerRows.map(async ({ partnerId }) => {
      const [partner] = await db
        .select({ id: usersTable.id, name: usersTable.name, studentRole: usersTable.studentRole, level: usersTable.level, avatarUrl: usersTable.avatarUrl })
        .from(usersTable)
        .where(eq(usersTable.id, partnerId))
        .limit(1);

      const [lastMsg] = await db
        .select()
        .from(messagesTable)
        .where(or(
          and(eq(messagesTable.senderId, myId), eq(messagesTable.receiverId, partnerId)),
          and(eq(messagesTable.senderId, partnerId), eq(messagesTable.receiverId, myId)),
        ))
        .orderBy(desc(messagesTable.createdAt))
        .limit(1);

      const [{ count: unreadCount }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(messagesTable)
        .where(and(
          eq(messagesTable.senderId, partnerId),
          eq(messagesTable.receiverId, myId),
          eq(messagesTable.isRead, false),
        ));

      return {
        partner: { ...partner, avatarUrl: partner?.avatarUrl ?? null },
        lastMessage: { ...lastMsg, createdAt: lastMsg.createdAt.toISOString() },
        unreadCount,
      };
    })
  );

  conversations.sort((a, b) =>
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  res.json(conversations);
});

router.get("/messages/:userId", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const partnerId = parseInt(req.params.userId as string, 10);
  if (isNaN(partnerId)) { res.status(400).json({ error: "Invalid userId" }); return; }

  const msgs = await db
    .select()
    .from(messagesTable)
    .where(or(
      and(eq(messagesTable.senderId, myId), eq(messagesTable.receiverId, partnerId)),
      and(eq(messagesTable.senderId, partnerId), eq(messagesTable.receiverId, myId)),
    ))
    .orderBy(asc(messagesTable.createdAt));

  res.json(msgs.map(m => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

router.post("/messages/:userId", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const receiverId = parseInt(req.params.userId as string, 10);
  if (isNaN(receiverId)) { res.status(400).json({ error: "Invalid userId" }); return; }

  const { content } = req.body as { content?: string };
  if (!content || !content.trim()) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const [msg] = await db
    .insert(messagesTable)
    .values({ senderId: myId, receiverId, content: content.trim(), isRead: false })
    .returning();

  res.status(201).json({ ...msg, createdAt: msg.createdAt.toISOString() });
});

router.patch("/messages/:userId/read", requireAuth, async (req, res): Promise<void> => {
  const myId = req.user!.id;
  const senderId = parseInt(req.params.userId as string, 10);
  if (isNaN(senderId)) { res.status(400).json({ error: "Invalid userId" }); return; }

  await db
    .update(messagesTable)
    .set({ isRead: true })
    .where(and(
      eq(messagesTable.senderId, senderId),
      eq(messagesTable.receiverId, myId),
      eq(messagesTable.isRead, false),
    ));

  res.status(204).end();
});

export default router;

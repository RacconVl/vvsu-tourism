import { Router, type IRouter } from "express";
import { db, communityPostsTable, galleryWorksTable, userActivityTable, usersTable, postCommentsTable } from "@workspace/db";
import { desc, asc, eq, sql } from "drizzle-orm";
import {
  ListCommunityPostsResponse,
  CreateCommunityPostBody,
  ListGalleryWorksResponse,
  CreatePostCommentBody,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.get("/community/posts", async (_req, res): Promise<void> => {
  const posts = await db.select().from(communityPostsTable).orderBy(desc(communityPostsTable.createdAt));
  res.json(ListCommunityPostsResponse.parse(posts.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }))));
});

router.post("/community/posts", requireAuth, async (req, res): Promise<void> => {
  const body = CreateCommunityPostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const u = req.user!;
  const [post] = await db.insert(communityPostsTable).values({
    userId: u.id,
    title: body.data.title,
    content: body.data.content,
    category: body.data.category,
    authorName: u.name,
    authorRole: u.studentRole,
    likes: 0,
    replies: 0,
  }).returning();

  await db.insert(userActivityTable).values({
    userId: u.id,
    type: "community",
    description: `Опубликован новый пост: «${body.data.title}»`,
    xpEarned: 25,
  });
  await db.update(usersTable).set({ xp: sql`${usersTable.xp} + 25` }).where(eq(usersTable.id, u.id));

  res.status(201).json({
    ...post,
    createdAt: post.createdAt.toISOString(),
  });
});

router.get("/community/posts/:id/comments", async (req, res): Promise<void> => {
  const postId = parseInt(req.params.id as string, 10);
  if (isNaN(postId)) {
    res.status(400).json({ error: "Invalid post id" });
    return;
  }
  const comments = await db
    .select()
    .from(postCommentsTable)
    .where(eq(postCommentsTable.postId, postId))
    .orderBy(asc(postCommentsTable.createdAt));
  res.json(comments.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

router.post("/community/posts/:id/comments", requireAuth, async (req, res): Promise<void> => {
  const postId = parseInt(req.params.id as string, 10);
  if (isNaN(postId)) {
    res.status(400).json({ error: "Invalid post id" });
    return;
  }
  const body = CreatePostCommentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const u = req.user!;
  const [comment] = await db.insert(postCommentsTable).values({
    postId,
    userId: u.id,
    authorName: u.name,
    authorRole: u.studentRole,
    content: body.data.content,
  }).returning();

  await db.update(communityPostsTable)
    .set({ replies: sql`${communityPostsTable.replies} + 1` })
    .where(eq(communityPostsTable.id, postId));

  res.status(201).json({ ...comment, createdAt: comment.createdAt.toISOString() });
});

router.get("/community/gallery", async (_req, res): Promise<void> => {
  const works = await db.select().from(galleryWorksTable).orderBy(desc(galleryWorksTable.createdAt));
  res.json(ListGalleryWorksResponse.parse(works.map(w => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
  }))));
});

export default router;

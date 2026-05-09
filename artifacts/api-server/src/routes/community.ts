import { Router, type IRouter } from "express";
import { db, communityPostsTable, galleryWorksTable, userActivityTable, usersTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import {
  ListCommunityPostsResponse,
  CreateCommunityPostBody,
  ListGalleryWorksResponse,
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

router.get("/community/gallery", async (_req, res): Promise<void> => {
  const works = await db.select().from(galleryWorksTable).orderBy(desc(galleryWorksTable.createdAt));
  res.json(ListGalleryWorksResponse.parse(works.map(w => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
  }))));
});

export default router;

import { Router, type IRouter } from "express";
import { db, libraryResourcesTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { ListLibraryResourcesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/library/resources", async (_req, res): Promise<void> => {
  const resources = await db.select().from(libraryResourcesTable).orderBy(asc(libraryResourcesTable.id));
  res.json(ListLibraryResourcesResponse.parse(resources));
});

export default router;

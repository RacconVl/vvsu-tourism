import { Router, type IRouter } from "express";
import { db, mapPointsTable, touristRoutesTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { ListMapPointsResponse, ListMapRoutesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/map/points", async (_req, res): Promise<void> => {
  const points = await db.select().from(mapPointsTable).orderBy(asc(mapPointsTable.id));
  res.json(ListMapPointsResponse.parse(points));
});

router.get("/map/routes", async (_req, res): Promise<void> => {
  const routes = await db.select().from(touristRoutesTable).orderBy(asc(touristRoutesTable.id));
  res.json(ListMapRoutesResponse.parse(routes.map(r => ({
    ...r,
    pointIds: r.pointIds.map(Number),
  }))));
});

export default router;

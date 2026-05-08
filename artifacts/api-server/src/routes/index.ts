import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import questsRouter from "./quests";
import achievementsRouter from "./achievements";
import mapRouter from "./map";
import communityRouter from "./community";
import libraryRouter from "./library";
import dashboardRouter from "./dashboard";
import quizzesRouter from "./quizzes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(questsRouter);
router.use(achievementsRouter);
router.use(mapRouter);
router.use(communityRouter);
router.use(libraryRouter);
router.use(dashboardRouter);
router.use(quizzesRouter);

export default router;

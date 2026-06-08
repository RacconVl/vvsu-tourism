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
import authRouter from "./auth";
import profileRouter from "./profile";
import adminRouter from "./admin";
import messagesRouter from "./messages";
import friendsRouter from "./friends";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(adminRouter);
router.use(coursesRouter);
router.use(questsRouter);
router.use(achievementsRouter);
router.use(mapRouter);
router.use(communityRouter);
router.use(libraryRouter);
router.use(dashboardRouter);
router.use(quizzesRouter);
router.use(messagesRouter);
router.use(friendsRouter);
router.use(notificationsRouter);

export default router;

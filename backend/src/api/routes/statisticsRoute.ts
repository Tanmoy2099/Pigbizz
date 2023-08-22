import { Router } from "express";
// import { isAuth } from "../middleware/isAuth";
import statisticsControllers from "../controllers/statisticsControllers";

const router = Router();
// router.use(isAuth)


router.get("/sell", statisticsControllers.getTotalSoldPigs)
router.get("/sell_by_gender", statisticsControllers.getTotalSoldGenderPigs)
router.get("/costs", statisticsControllers.getCosts)
router.get("/weekly_overview", statisticsControllers.weeklyOverview)


export { router as statisticsRoute };




import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import settingControllers from "../controllers/settingControllers";

const router = Router();
// router.use(isAuth);


router
    .route("/")
    .get(settingControllers.settingGet)

export { router as settingRoute };
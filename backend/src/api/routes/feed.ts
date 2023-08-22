import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import feedControllers from "../controllers/feedControllers";


const router = Router();
// router.use(isAuth);

router
    .route("/planer")
    .get(feedControllers.feedPlanerGet)
    .post(feedControllers.feedPlanerPost)
    .put(feedControllers.feedPlanerUpdate);

router
    .route("/planer/:id")
    .delete(feedControllers.feedPlanerDelete);

export { router as feedRoute };

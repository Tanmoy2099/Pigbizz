import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import feedInventoryControllers from "../controllers/feedInventoryControllers";

const router = Router();
// router.use(isAuth)


router
    .route("/")
    .get(feedInventoryControllers.allFeedinventoryGet)
    .post(feedInventoryControllers.feedInventoryAdd)
    .put(feedInventoryControllers.feedinventoryUpdate);

router
    .route('/type')
    .get(feedInventoryControllers.getType)
    .post(feedInventoryControllers.addFeedType);

router
    .route("/names")
    .get(feedInventoryControllers.allFeedNameGet);

router
    .route('/type/:type')
    .delete(feedInventoryControllers.deleteFeedType);

router
    .route("/:id")
    .delete(feedInventoryControllers.feedinventoryDelete);


export { router as feedInventoryRoute };
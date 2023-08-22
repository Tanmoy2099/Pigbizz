import { Router } from "express";
// import { isAuth } from "../middleware/isAuth";
import soldPigsControllers from "../controllers/soldPigsControllers";

const router = Router();
// router.use(isAuth)


router
    .route("/")
    .get(soldPigsControllers.getSoldPigs)
// .post(soldPigsControllers.postsoldPigs)
// .put(soldPigsControllers.editsoldPigs);

router.route('/:id').get(soldPigsControllers.getUniqueSoldPigs)


export { router as soldPigsRoute };
import { Router } from "express";
import pigDetailsController from "../controllers/pigDetailsController";

const router = Router();
// router.use(isAuth)

router
  .route("/")
  .get(pigDetailsController.getPigs)
  .post(pigDetailsController.pigAdd)
  .put(pigDetailsController.pigUpdate)
  .delete(pigDetailsController.pigDelete);

router.get("/pigs-per-batch/:batch", pigDetailsController.pigsPerBatch);

router.get("/all-batch", pigDetailsController.allBatch);
router.post("/add-batch", pigDetailsController.addBatch);
router.delete("/delete-batch", pigDetailsController.deleteBatch);
router.post("/batch-update", pigDetailsController.pigEdit);
router.put("/edit-batch", pigDetailsController.editBatch);

router.get("/tags", pigDetailsController.tags);

router.get("/feeding-plan", pigDetailsController.feedingPlanAssign);
router.get("/notifications", pigDetailsController.fetchNotifications);

router.get(
  "/birth-to-finish-feeding-plan",
  pigDetailsController.birthToFinishFeedingPlan
);

router.get(
  "/birth-to-finish-medicine-plan",
  pigDetailsController.birthToFinishMedicinePlan
);

router.get(
  "/breeder-and-lactation-feeding-plan",
  pigDetailsController.breederAndLactationFeedingPlan
);

router.post("/sell-pigs", pigDetailsController.sellPigs);

router.get("/sold-pigs", pigDetailsController.getSoldPigs);

router.get("/get-pigs-by-tag", pigDetailsController.getPigsByGenderTag);

export { router as pigRoute };

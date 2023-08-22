import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import medicineInventoryControllers from "../controllers/medicineInventoryControllers";

const router = Router();
// router.use(isAuth)


router
    .route("/")
    .get(medicineInventoryControllers.allMedicineinventoryGet)
    .post(medicineInventoryControllers.medicineinventoryAdd)
    .put(medicineInventoryControllers.medicineinventoryUpdate);

router
    .route('/status')
    .get(medicineInventoryControllers.status);

router
    .route("/names")
    .get(medicineInventoryControllers.allMedicineNameGet);

router
    .route("/:id")
    .delete(medicineInventoryControllers.medicineinventoryDelete);

export { router as medicineInventoryRoute };
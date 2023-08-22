import { Router } from "express";
import assignMedicineControllers from "../controllers/assignMedicineControllers";

const router = Router();
// router.use(isAuth)

router
  .route("/")
  .post(assignMedicineControllers.medicineAdd)
  .get(assignMedicineControllers.medicineGet)
  .put(assignMedicineControllers.medicineUpdate);

router
  .route("/type")
  .get(assignMedicineControllers.medicineType)
  .post(assignMedicineControllers.addMedicineType);

router
  .route("/:id")
  .get(assignMedicineControllers.medicineGetOne)
  .delete(assignMedicineControllers.medicineDelete);

export { router as assignMedicineRoute };

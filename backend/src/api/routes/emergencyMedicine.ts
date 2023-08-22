import { Router } from "express";
import emergencyMedicineControllers from "../controllers/emergencyMedicineControllers";


const router = Router();

router
    .route("/")
    .get(emergencyMedicineControllers.emergencyMedicineGet)
    .post(emergencyMedicineControllers.emergencyMedicineAdd)
    .put(emergencyMedicineControllers.emergencyMedicineUpdate);

router.route('/:id')
    .get(emergencyMedicineControllers.emergencyMedicineGetOne)
    .delete(emergencyMedicineControllers.emergencyMedicineDelete);

export { router as emergencyMedicineRoute };

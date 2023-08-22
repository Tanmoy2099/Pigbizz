// dashboardUserController

import { Router } from "express";
import {
  feedStockCount,
  medicineStockCount,
  totalFemalePigCount,
  totalMalePigCount,
  totalPigletCount,
  totalProductsCount,
  feedMedicineGraph,
} from "../controllers/dashboardUserController";

const router = Router();

router.route("/total-product-count").get(totalProductsCount);

router.route("/total-male-pig-count").get(totalMalePigCount);
router.route("/total-female-pig-count").get(totalFemalePigCount);
// router.route("/total-female-pig-count").get(totalFemalePigCount);
// router.route("/total-female-pig-count").get(totalFemalePigCount);
router.route("/total-pig-count").get(totalPigletCount);
router.route("/medicine-stock-count").get(medicineStockCount);
router.route("/feed-stock-count").get(feedStockCount);
router.route("/feed-medicine-raph").get(feedMedicineGraph);

export { router as dashboardUserRoute };

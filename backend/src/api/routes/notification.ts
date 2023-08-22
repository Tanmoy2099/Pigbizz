import { Router } from "express";
import {
  findNotificationByUserId,
  findNotificationByUserIdCurrentDay,
} from "../controllers/notificationController";

const router = Router();

router.route("/get-user-notification").get(findNotificationByUserId);
router
  .route("/get-user-notification-today")
  .get(findNotificationByUserIdCurrentDay);

export { router as notificationRoute };

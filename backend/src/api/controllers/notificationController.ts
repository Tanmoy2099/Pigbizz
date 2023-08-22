import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
import {
  findNotificationByUserIdCurrentDayDB,
  findNotificationByUserIdDB,
} from "../../utilServer/prismaCRUD/notificationDB";

export const findNotificationByUserId = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.query;

    // @ts-ignore
    const notifications = await findNotificationByUserIdDB(userId);

    return res.status(200).json({ status: "ok", data: notifications });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

export const findNotificationByUserIdCurrentDay = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.query;

    // @ts-ignore
    const notifications = await findNotificationByUserIdCurrentDayDB(userId);

    return res.status(200).json({ status: "ok", data: notifications });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

import type { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
import { AppError } from "../../utilServer/catchError";
import { NextFunction, Response } from "express";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import { getSettingDB } from "../../utilServer/prismaCRUD/settingDB";

//1
const settingGet = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let data;
    try {
        data = await getSettingDB();
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});

export default { settingGet }
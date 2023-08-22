import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
// import { AppError } from "../../utilServer/catchError";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";

import { getCostsDB, getTotalSellDB, getTotalSellGenderDB, getWeeklyOverviewDB } from "../../utilServer/prismaCRUD/soldPigsDB";
import { AppError } from "../../utilServer/catchError";


const getTotalSoldPigs = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    // let data: any[] = [];
    try {
        const data = await getTotalSellDB();

        return res.status(200).json({ status: 'ok', data });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});

const getTotalSoldGenderPigs = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    // let data: any[] = [];
    try {
        const data = await getTotalSellGenderDB();

        return res.status(200).json({ status: 'ok', data });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});

const getCosts = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    // let data: any[] = [];
    try {
        const data = await getCostsDB();

        return res.status(200).json({ status: 'ok', data });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});


const weeklyOverview = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    try {
        const data = await getWeeklyOverviewDB();

        return res.status(200).json({ status: 'ok', data });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});



export default { getTotalSoldPigs, getTotalSoldGenderPigs, getCosts, weeklyOverview }
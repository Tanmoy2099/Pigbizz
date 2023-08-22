import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
// import { AppError } from "../../utilServer/catchError";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";

import { getSoldPigsDB, getSoldPigsCountDB, getUniqueSoldPigsDB } from "../../utilServer/prismaCRUD/soldPigsDB";
import { AppError } from "../../utilServer/catchError";

const getSoldPigs = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    const { l, p } = req.query
    let limit = 100, page = 0;
    if (p) { page = +p };
    if (l) { limit = +l };

    let data: any[] = [];
    try {
        data = await getSoldPigsDB(page, limit);
        const count = await getSoldPigsCountDB();

        return res.status(200).json({ status: 'ok', data, total: data.length, count, page });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});

const getUniqueSoldPigs = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) next(new AppError(404, "unique id is not given"));

    let data: any = {};
    try {
        data = await getUniqueSoldPigsDB(id);

        if (data.length === 0) next(new AppError(404, 'data not found'));
        return res.status(200).json({ status: 'ok', data });
    } catch (error) {
        errorHandlerDB(error)
    }
    return

})


export default { getSoldPigs, getUniqueSoldPigs }
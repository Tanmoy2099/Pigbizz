import { NextFunction, Response } from "express";
import type { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
import { AppError } from "../../utilServer/catchError";
import { addFeedDB, getFeedDB, getFeedCountDB, updateFeedDB, deleteFeedDB } from "../../utilServer/prismaCRUD/feedDB";

import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import { getBatchDB, getTagNoDB } from "../../utilServer/prismaCRUD/pigDetailsDB";
import { checkFeedNameInInventory } from "../../utilServer/prismaCRUD/feedInventoryDB";
// import { appendInventoryMedicineDataDB, appendInventoryMedicineTransactionDataDB, deleteInventoryMedicineDataDB, getAllinventoryMedicineCountDB, getAllInventoryMedicineDataDB, updateInventoryMedicineTransactionDataDB } from '../../utilServer/prismaCRUD/medicineInventoryDB';

//1
const feedPlanerPost = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let { feed_name, feed_type, batch_no, tag_no, quantity, cost, date } = req.body;

    if (!batch_no && !tag_no) throw new AppError(404, "Batch number or Tag no should be given");

    if (!feed_name) throw new AppError(404, "Feed name should be given");
    if (!feed_type) throw new AppError(404, "Feed type should be given");
    if (!quantity || parseInt(quantity) < 0) throw new AppError(404, "Quantity should be a positive number");
    if (!cost || parseInt(cost) < 0) throw new AppError(404, "Cost should be a positive number");
    if (!date) throw new AppError(404, "Date should be given");
    const batchExist = await getBatchDB(batch_no);
    if (!batchExist) throw new AppError(404, "Batch number does not exist ");

    let assign_type = 'batch'
    const values: any = { feed_name, batch_no, quantity, cost, date: new Date(date) }
    values.feed_type = feed_type[0].toUpperCase() + feed_type.slice(1).toLowerCase();

    if (tag_no) {
        assign_type = 'individual'
        delete values.batch_no
        values.tag_no = tag_no
    }
    values.assign_type = assign_type

    let data;
    try {
        data = await addFeedDB(values)
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});

//2
//TODO: modify more
const feedPlanerGet = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    const { l, p } = req.query
    let limit = 100, page = 0;
    if (p) { page = Number(p) }
    if (l) { limit = Number(l) }
    let data: any[] = [];
    try {
        //@ts-ignore
        data = await getFeedDB(page, limit);
        const count = await getFeedCountDB();

        return res.status(200).json({ status: 'ok', data, total: data.length, count, page });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});

//3
const feedPlanerUpdate = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let { id, feed_name, feed_type, batch_no, tag_no, quantity, cost, date } = req.body;

    if (!id || isNaN(parseInt(id))) throw new AppError(401, "Please provide a valid id");


    const dataToModify: any = {}
    let assign_type: string | null = null;
    if (batch_no) {
        batch_no = batch_no.toLowerCase();
        const batchExist = await getBatchDB(batch_no);
        if (!batchExist) throw new AppError(401, "batch number does not exist");
        dataToModify.batch_no = batch_no
        dataToModify.tag_no = null
        assign_type = 'batch';
    } else if (tag_no) {
        tag_no = tag_no.toLowerCase();
        console.log(tag_no, 'tag_no 87');
        const tag_noExist = await getTagNoDB(tag_no);
        if (tag_noExist.length <= 0) throw new AppError(401, "Tag number does not exist");
        dataToModify.tag_no = tag_no
        dataToModify.batch_no = null
        assign_type = 'individual';
    }
    if (assign_type) {
        dataToModify.assign_type = assign_type
    }

    if (feed_name) {

        const name = await checkFeedNameInInventory(feed_name)
        if (name) { dataToModify.feed_name = feed_name }
    }

    if (feed_type) {
        dataToModify.feed_type = feed_type[0].toUpperCase() + feed_type.slice(1).toLowerCase();
    }

    if (quantity) {
        if (isNaN(parseInt(quantity)) || parseInt(quantity) < 0) throw new AppError(401, "Quantity should be a positive number")
        dataToModify.quantity = quantity
    }

    if (cost) {
        if (isNaN(parseInt(cost)) || parseInt(cost) < 0) throw new AppError(401, "Cost should be a positive number")
        dataToModify.cost = cost
    }

    if (date) {
        dataToModify.date = new Date(date);
    }

    let data;
    try {
        data = await updateFeedDB(id, dataToModify)
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});

const feedPlanerDelete = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id || isNaN(+id)) throw new AppError(404, "Please provide a valid id");
    const givenId = +id
    let data;
    try {
        data = await deleteFeedDB(givenId)
    } catch (error) {
        errorHandlerDB(error)
    }
    return res.status(200).json({ status: 'ok', data });
});

export default { feedPlanerGet, feedPlanerPost, feedPlanerUpdate, feedPlanerDelete };
import type { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
import { AppError } from "../../utilServer/catchError";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import { getAFeedTypeDB, appendInventoryFeedTransactionDataDB, appendInventoryFeedDataDB, getAllInventoryFeedDataDB, getAllinventoryAssignedFeedCountDB, updateInventoryFeedTransactionDataDB, deleteInventoryFeedDataDB, getFeedTypeDB, addFeedTypeDB, deleteType, getAllInventoryFeedName } from '../../utilServer/prismaCRUD/feedInventoryDB';
import { NextFunction, Response } from "express";
import { getSettingDB } from "../../utilServer/prismaCRUD/settingDB";


//1
const feedInventoryAdd = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    let { feed_name, date, cost, quantity, feed_type } = req.body;

    if (!feed_name) throw new AppError(400, "feed name should be given ");
    if (!cost || parseInt(cost) <= 0) throw new AppError(400, "please enter a valid cost value ")
    // if (!feed_type) throw new AppError(400, "feed type should be given ")
    if (!quantity || parseInt(quantity) <= 0) throw new AppError(400, "please enter a valid quantity value")
    if (!date) throw new AppError(400, "please enter a valid date")
    // if (!price || parseInt(price) < 0) throw new AppError(400, "Price should be a positive number")

    feed_name = feed_name.toLowerCase();
    feed_type = feed_type.toLowerCase();

    const feedTypeExist = await getAFeedTypeDB(feed_type);
    if (!feedTypeExist) throw new AppError(400, "Feed type does not exist ");

    let data;
    try {
        data = await appendInventoryFeedTransactionDataDB({ feed_name, cost, quantity, feed_type, date: new Date(date) });
    } catch (error) {
        errorHandlerDB(error)
    }
    try {
        await appendInventoryFeedDataDB({ feed_name, cost, quantity, feed_type });
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});



//2
//TODO: modify more
const allFeedinventoryGet = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    const { l, p } = req.query
    let limit = 100, page = 0;
    if (p) { page = Number(p) }
    if (l) { limit = Number(l) }
    let data: any[] = [];
    try {
        //@ts-ignore
        data = await getAllInventoryFeedDataDB(page, limit);
        const count = await getAllinventoryAssignedFeedCountDB();

        return res.status(200).json({ status: 'ok', data, total: data.length, count, page });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});

//3
const feedinventoryUpdate = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    let { id, feed_name, date, cost, quantity, feed_type } = req.body;


    if (!id || isNaN(parseInt(id))) throw new AppError(400, "Please enter a valid id ");
    if (!feed_name) throw new AppError(400, "feed name should be given ");
    if (!cost || parseInt(cost) <= 0) throw new AppError(400, "please enter a valid cost value ")
    // if (!feed_type) throw new AppError(400, "feed type should be given ")
    if (!quantity || parseInt(quantity) <= 0) throw new AppError(400, "please enter a valid quantity value")
    if (!date) throw new AppError(400, "please enter a valid date")
    // if (!price || parseInt(price) < 0) throw new AppError(400, "Price should be a positive number")

    feed_name = feed_name.toLowerCase();
    feed_type = feed_type.toLowerCase();

    const feedTypeExist = await getAFeedTypeDB(feed_type)
    if (!feedTypeExist) throw new AppError(400, "Feed type does not exist ")


    let data = await updateInventoryFeedTransactionDataDB(parseInt(id), { feed_name, cost, quantity, feed_type, date: new Date(date) });

    return res.status(200).json({ status: 'ok', data });

})


//5
const feedinventoryDelete = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {


    const { id } = req.params;
    if (!id) throw new AppError(401, 'Feed id is not given')
    const givenId = parseInt(id)
    if (isNaN(givenId)) throw new AppError(401, 'Given id is not a number')

    let data;
    try {
        data = await deleteInventoryFeedDataDB(givenId);
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});

const addFeedType = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let { type } = req.body;
    if (!type) throw new AppError(400, 'Please include the \'type\' in url params ');
    type = type.toLowerCase();
    try {
        const ifExists = await getAFeedTypeDB(type);
        console.log(ifExists);

        if (ifExists) throw new AppError(400, 'Given type already exist')
    } catch (error) {
        errorHandlerDB(error);
    }

    try {
        const data = await addFeedTypeDB(type);
        return res.status(200).json({ status: 'ok', data });
    } catch (error) {
        return errorHandlerDB(error)
    }
});

const getType = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    let data;
    try {
        data = await getFeedTypeDB();
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
})


const deleteFeedType = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { type } = req.params
    if (!type) throw new AppError(400, 'Please include the \'type\' in url params ')
    let data;
    let ifExists
    try {
        ifExists = await getAFeedTypeDB(type)
    } catch (error) {
        errorHandlerDB(error)
    }

    if (!ifExists) throw new AppError(400, 'Given type does not exist')
    try {
        data = await deleteType(type)
    } catch (error) {

    }

    return res.status(200).json({ status: 'ok', data });
});


const allFeedNameGet = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const data = await getAllInventoryFeedName();
    return res.status(200).json({ status: 'ok', data });
})

export default { feedInventoryAdd, allFeedinventoryGet, feedinventoryUpdate, feedinventoryDelete, addFeedType, getType, deleteFeedType, allFeedNameGet };
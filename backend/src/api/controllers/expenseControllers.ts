import { NextFunction, Response } from "express"
import { AuthRequest } from "../../types/authRequest"
import { catchAsync } from "../../utilServer/catchAsync"
import { deleteExpenseDB, getACostTypeDB, getCostTypeDB, getExpenseCountDB, getExpenseDB, postExpenseDataDB, putExpenseDataDB } from "../../utilServer/prismaCRUD/getCostTypeDB";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import { AppError } from "../../utilServer/catchError";

const getTypes = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let data
    try {
        data = await getCostTypeDB()
        return res.status(200).json({ status: 'ok', data })
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});

const postExpense = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let { expense_name, cost_type: type, cost, date: dateType } = req.body;

    if (!expense_name) throw new AppError(400, 'Expense Name is not given');
    const name = expense_name.toLowerCase();

    const cost_type = type?.toLowerCase()
    const date = new Date(dateType)

    if (!cost || cost <= 0) throw new AppError(400, 'Please enter a valid cost');
    if (!date) throw new AppError(400, 'Date is Not Valid');

    const costType = await getACostTypeDB(cost_type)
    if (!costType) throw new AppError(400, 'Cost Type is not valid');

    const data = await postExpenseDataDB({ name, cost_type, cost, date })

    return res.status(200).json({ status: 'ok', data })

});

//TODO: modify to this to get expense data month wise
const getExpense = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    const { l, p, month: m } = req.query
    let limit = 100, page = 0, month = 0;
    if (p) { page = +p }
    if (l) { limit = +l }
    if (m) { month = +m }

    let data: any[] = [];
    try {
        data = await getExpenseDB(page, limit, month);
        const count = await getExpenseCountDB(month);

        return res.status(200).json({ status: 'ok', data, total: data.length, count, page });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});


const deleteExpense = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id || isNaN(+id)) throw new AppError(404, "Please provide a valid id");
    const givenId = +id
    let data;
    try {
        data = await deleteExpenseDB(givenId)
    } catch (error) {
        errorHandlerDB(error)
    }
    return res.status(200).json({ status: 'ok', data });
});


const editExpense = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let { id, expense_name, cost_type: type, cost, date: dateType } = req.body;

    if (!id || isNaN(+id)) throw new AppError(404, "Please provide a valid id");
    const givenId = +id

    if (!expense_name) throw new AppError(400, 'Expense Name is not given');
    const name = expense_name.toLowerCase();

    const cost_type = type?.toLowerCase();
    const date = new Date(dateType);

    if (!cost || cost <= 0) throw new AppError(400, 'Please enter a valid cost');
    if (!date) throw new AppError(400, 'Date is Not Valid');

    const costType = await getACostTypeDB(cost_type)
    if (!costType) throw new AppError(400, 'Cost Type is not valid');

    const data = await putExpenseDataDB({ id, name, cost_type, cost, date })

    return res.status(200).json({ status: 'ok', data })

});


export default { getTypes, postExpense, getExpense, deleteExpense, editExpense };
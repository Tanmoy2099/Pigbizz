import type { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
import { AppError } from "../../utilServer/catchError";
import { getAMedicineTypeDB, getAllMedicineTypeDB, runningOutMedicineDB, stockLeftDB } from "../../utilServer/prismaCRUD/assignMedicineDB";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import { appendInventoryMedicineDataDB, appendInventoryMedicineTransactionDataDB, deleteInventoryMedicineDataDB, getAllinventoryMedicineCountDB, getAllInventoryMedicineDataDB, getAllInventoryMedicineName, updateInventoryMedicineTransactionDataDB } from '../../utilServer/prismaCRUD/medicineInventoryDB';
import { NextFunction, Response } from "express";
import { getSettingDB } from "../../utilServer/prismaCRUD/settingDB";

//1
const medicineinventoryAdd = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    let { medicine_name, date, cost, quantity, medicine_type } = req.body;

    if (!medicine_name) throw new AppError(400, "medicine name should be given ");
    if (!cost || parseInt(cost) <= 0) throw new AppError(400, "please enter a valid cost value ")
    // if (!medicine_type) throw new AppError(400, "medicine type should be given ")
    if (!quantity || parseInt(quantity) <= 0) throw new AppError(400, "please enter a valid quantity value")
    if (!date) throw new AppError(400, "please enter a valid date")
    // if (!price || parseInt(price) < 0) throw new AppError(400, "Price should be a positive number")

    medicine_name = medicine_name.toLowerCase();
    medicine_type = medicine_type.toLowerCase();

    const medicineTypeExist = await getAMedicineTypeDB(medicine_type)
    if (!medicineTypeExist) throw new AppError(400, "Medicine type does not exist ")

    let data;
    try {
        data = await appendInventoryMedicineTransactionDataDB({ medicine_name, cost, quantity, medicine_type, date: new Date(date) });
    } catch (error) {
        errorHandlerDB(error)
    }
    try {
        await appendInventoryMedicineDataDB({ medicine_name, cost, quantity, medicine_type });
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});

//2
//TODO: modify more
const allMedicineinventoryGet = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    const { l, p } = req.query
    let limit = 100, page = 0;
    if (p) { page = Number(p) }
    if (l) { limit = Number(l) }
    let data: any[] = [];
    try {
        //@ts-ignore
        data = await getAllInventoryMedicineDataDB(page, limit);
        const count = await getAllinventoryMedicineCountDB();

        return res.status(200).json({ status: 'ok', data, total: data.length, count: count - 1 });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});

//3
const medicineinventoryUpdate = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    let { id, medicine_name, date, cost, quantity, medicine_type } = req.body;


    if (!id || isNaN(parseInt(id))) throw new AppError(400, "Please enter a valid id ");
    if (!medicine_name) throw new AppError(400, "medicine name should be given ");
    if (!cost || parseInt(cost) <= 0) throw new AppError(400, "please enter a valid cost value ")
    // if (!medicine_type) throw new AppError(400, "medicine type should be given ")
    if (!quantity || parseInt(quantity) <= 0) throw new AppError(400, "please enter a valid quantity value")
    if (!date) throw new AppError(400, "please enter a valid date")
    // if (!price || parseInt(price) < 0) throw new AppError(400, "Price should be a positive number")

    medicine_name = medicine_name.toLowerCase();
    medicine_type = medicine_type.toLowerCase();

    const medicineTypeExist = await getAMedicineTypeDB(medicine_type)
    if (!medicineTypeExist) throw new AppError(400, "Medicine type does not exist ")


    let data = await updateInventoryMedicineTransactionDataDB(parseInt(id), { medicine_name, cost, quantity, medicine_type, date: new Date(date) });

    return res.status(200).json({ status: 'ok', data });

})


//5
const medicineinventoryDelete = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {


    const { id } = req.params;
    if (!id) throw new AppError(401, 'Medicine id is not given')
    const givenId = parseInt(id)
    if (isNaN(givenId)) throw new AppError(401, 'Given id is not a number')


    let data;
    try {
        data = await deleteInventoryMedicineDataDB(givenId);
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});

//5
const status = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    let data: { runningOut?: number, stockLeft?: number } = {};
    let setting
    try {
        setting = await getSettingDB()
    } catch (error) {
        errorHandlerDB(error)
    }

    {/* TODO: Today's use */ }
    {/* TODO: Last week use */ }

    {/* Stock left */ }
    data.stockLeft = await stockLeftDB()

    {/* Running out items */ }
    data.runningOut = await runningOutMedicineDB(setting?.low_medicine_parameter ? setting?.low_medicine_parameter : 19)

    return res.status(200).json({ status: 'ok', data });
});

const allMedicineNameGet = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const data = await getAllInventoryMedicineName();
    return res.status(200).json({ status: 'ok', data });
})

export default { medicineinventoryAdd, allMedicineinventoryGet, medicineinventoryUpdate, medicineinventoryDelete, status, allMedicineNameGet };
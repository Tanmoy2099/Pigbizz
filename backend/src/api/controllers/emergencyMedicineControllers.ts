import type { AuthRequest } from "../../types/authRequest";
import type { MedicineUpdateData } from "../../types/medicine";
import { catchAsync } from "../../utilServer/catchAsync";
import { AppError } from "../../utilServer/catchError";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import { appendEmergencyMedicineDataDB, deleteEmergencyMedicineDataDB, getAllEmergencyMedicineCountDB, getAllEmergencyMedicineDataDB, getEmergencyMedicineDataDB, updateEmergencyMedicineDataDB } from '../../utilServer/prismaCRUD/emergencyMedicineDB';
import { checkMedicineNameInInventory } from "../../utilServer/prismaCRUD/medicineInventoryDB";
import { getBatchDB } from "../../utilServer/prismaCRUD/pigDetailsDB";
import { NextFunction, Response } from "express";


//1
const emergencyMedicineAdd = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    const { medicine_name, batch_no, price, dose, date } = req.body;

    if (!batch_no) throw new AppError(401, "batch number should be given ")
    if (!medicine_name) throw new AppError(401, "medicine name should be given ")
    // if (!medicine_type) throw new AppError(401, "medicine type should be given ")
    if (!dose || parseInt(dose) < 0) throw new AppError(401, "does should be a positive number")
    if (!date) throw new AppError(401, "date should be given ")
    if (!price || parseInt(price) < 0) throw new AppError(401, "Price should be a positive number")


    const batchExist = await getBatchDB(batch_no)
    if (!batchExist) throw new AppError(401, "batch number does not exist ")
    let data;
    try {
        // data = await addMedicineDataDB({ medicine_name, batch_no: batch, price, medicine_type, dose, date })
        data = await appendEmergencyMedicineDataDB({ medicine_name, batch_no, price, dose, date: new Date(date) })
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});


//2
const emergencyMedicineGet = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { l, p } = req.query
    let limit = 100, page = 0;
    if (p) { page = Number(p) }
    if (l) { limit = Number(l) }
    let data;
    try {
        data = await getAllEmergencyMedicineDataDB(page, limit);
        const count = await getAllEmergencyMedicineCountDB();

        return res.status(200).json({ status: 'ok', data, total: data.length, count: count - 1 });
    } catch (error) {
        errorHandlerDB(error)
    }
    return
});


//3
const emergencyMedicineGetOne = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) throw new AppError(401, 'Medicine id is not given')
    const givenId = parseInt(id)

    if (isNaN(givenId)) throw new AppError(401, 'Given id is not a number')

    let data;
    try {
        data = await getEmergencyMedicineDataDB(givenId);
    } catch (error) {
        errorHandlerDB(error)
    }
    return res.status(200).json({ status: 'ok', data });
})

//4
const emergencyMedicineUpdate = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    const { id, medicine_name, batch_no, price, dose, date } = req.body;
    const updateData: MedicineUpdateData = {};

    if (medicine_name) {
        const name = await checkMedicineNameInInventory(medicine_name)
        if (name) { updateData.medicine_name = medicine_name }
    }
    if (batch_no) updateData.batch_no = batch_no;
    if (price) updateData.price = price;
    if (dose) updateData.dose = dose;
    if (date) updateData.date = new Date(date);

    if (!id || typeof parseInt(id) !== 'number') throw new AppError(400, "Please provide a valid id")
    const giveId = parseInt(id)
    if (Object.keys(updateData).length <= 0) return res.status(200).json({ status: 'ok', data: {} });
    console.log(updateData);

    let data;
    try {
        data = await updateEmergencyMedicineDataDB(giveId, updateData);
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});


//5
const emergencyMedicineDelete = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {


    const { id } = req.params;
    if (!id) throw new AppError(401, 'Medicine id is not given')
    const givenId = parseInt(id)
    if (isNaN(givenId)) throw new AppError(401, 'Given id is not a number')

    let data;
    try {
        data = await deleteEmergencyMedicineDataDB(givenId);
    } catch (error) {
        errorHandlerDB(error)
    }

    return res.status(200).json({ status: 'ok', data });
});


export default { emergencyMedicineAdd, emergencyMedicineGet, emergencyMedicineGetOne, emergencyMedicineUpdate, emergencyMedicineDelete };
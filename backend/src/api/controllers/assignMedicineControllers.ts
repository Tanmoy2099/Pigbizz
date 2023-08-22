import { NextFunction, Response } from "express";
import type { AuthRequest } from "../../types/authRequest";
import type { MedicineUpdateData } from "../../types/medicine";
import { catchAsync } from "../../utilServer/catchAsync";
import { AppError } from "../../utilServer/catchError";
import {
  addMedicineDataDB as addAssignedMedicineDataDB,
  addMedicineTypeDB,
  deleteMedicineDataDB,
  getAllAssignedMedicineCountDB,
  getAllMedicineDataPaginatedDB,
  getAllMedicineTypeDB,
  getMedicineByTypeDB,
  getMedicineDataDB,
  updateMedicineDataDB,
} from "../../utilServer/prismaCRUD/assignMedicineDB";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import { getBatchDB } from "../../utilServer/prismaCRUD/pigDetailsDB";

//1
const medicineAdd = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { medicine_name, batch_no, price, medicine_type, dose, date } =
    req.body;

  if (!batch_no) throw new AppError(401, "batch number should be given ");
  if (!medicine_name) throw new AppError(401, "medicine name should be given ");
  if (!medicine_type) throw new AppError(401, "medicine type should be given ");
  if (!dose || parseInt(dose) < 0)
    throw new AppError(401, "does should be a positive number");
  if (!date) throw new AppError(401, "date should be given ");
  if (!price || parseInt(price) < 0)
    throw new AppError(401, "Price should be a positive number");

  const batchExist = await getBatchDB(batch_no);
  if (!batchExist) throw new AppError(401, "batch number does not exist ");
  let data;
  try {
    // data = await addMedicineDataDB({ medicine_name, batch_no: batch, price, medicine_type, dose, date })
    data = await addAssignedMedicineDataDB({
      medicine_name,
      batch_no,
      price,
      medicine_type,
      dose,
      date: new Date(date),
    });
  } catch (error) {
    errorHandlerDB(error);
  }

  return res.status(200).json({ status: "ok", data });
});

//2
const medicineGet = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  let { l, p, filter } = req.query;
  let fltr = "";
  if (filter !== undefined) {
    //@ts-ignore
    fltr = filter.toLowerCase();
  }
  let limit = 100,
    page = 0;
  if (p) {
    page = Number(p);
  }
  if (l) {
    limit = Number(l);
  }
  let data;
  try {
    data = await getAllMedicineDataPaginatedDB(page, limit, fltr);
    const count = await getAllAssignedMedicineCountDB();

    return res
      .status(200)
      .json({ status: "ok", data, total: data.length, count: count - 1 });
  } catch (error) {
    errorHandlerDB(error);
  }
  return;
});

//3
const medicineGetOne = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { id } = req.params;
  if (!id) throw new AppError(401, "Medicine id is not given");
  const givenId = parseInt(id);

  if (isNaN(givenId)) throw new AppError(401, "Given id is not a number");

  let data;
  try {
    data = await getMedicineDataDB(givenId);
  } catch (error) {
    errorHandlerDB(error);
  }
  return res.status(200).json({ status: "ok", data });
});

//4
const medicineUpdate = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { id, medicine_name, batch_no, price, medicine_type, dose, date } =
    req.body;
  const updateData: MedicineUpdateData = {};

  if (medicine_name) updateData.medicine_name = medicine_name;
  if (batch_no) updateData.batch_no = batch_no;
  if (price) updateData.price = price;
  if (medicine_type) updateData.medicine_type = medicine_type;
  if (dose) updateData.dose = dose;
  if (date) updateData.date = new Date(date);

  if (!id || typeof parseInt(id) !== "number")
    throw new AppError(400, "Please provide a valid id");
  const giveId = parseInt(id);
  if (Object.keys(updateData).length <= 0)
    return res.status(200).json({ status: "ok", data: {} });
  console.log(updateData);

  let data;
  try {
    data = await updateMedicineDataDB(giveId, updateData);
  } catch (error) {
    errorHandlerDB(error);
  }

  return res.status(200).json({ status: "ok", data });
});

//5
const medicineDelete = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { id } = req.params;
  if (!id) throw new AppError(401, "Medicine id is not given");
  const givenId = parseInt(id);
  if (isNaN(givenId)) throw new AppError(401, "Given id is not a number");

  let data;
  try {
    data = await deleteMedicineDataDB(givenId);
  } catch (error) {
    errorHandlerDB(error);
  }

  return res.status(200).json({ status: "ok", data });
});

//6
const medicineType = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  let data;
  try {
    data = await getAllMedicineTypeDB();
    console.log(data);
  } catch (error) {
    return errorHandlerDB(error);
  }
  return res.status(200).json({ status: "ok", data });
});

//7
const addMedicineType = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { type } = req.body;

  if (!type) throw new AppError(401, "Medicine type is not valid");

  let data;
  try {
    data = await addMedicineTypeDB(type);
  } catch (error) {
    errorHandlerDB(error);
  }
  return res.status(200).json({ status: "ok", data });
});

const getMedicineByType = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { type } = req.params;
  if (!type) throw new AppError(401, "Medicine type is invalid");

  let data;

  try {
    data = await getMedicineByTypeDB(type);
  } catch (error) {
    errorHandlerDB(error);
  }
  return res.status(200).json({ status: "ok", data });
});


const medicineController = {
  medicineAdd,
  medicineGet,
  medicineGetOne,
  medicineUpdate,
  medicineDelete,
  medicineType,
  addMedicineType,
};
export default medicineController;

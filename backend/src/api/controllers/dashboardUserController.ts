import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
import {
  feedGraphDB,
  feedStockCountDB,
  medicineGraphDB,
  medicineStockCountDB,
  totalFemalePigCountDB,
  totalMalePigCountDB,
  totalPigletCountDB,
} from "../../utilServer/prismaCRUD/dashboardUserDB";

export const totalProductsCount = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const totalFemaleCount = await totalFemalePigCountDB();
    const totalMaleCount = await totalMalePigCountDB();
    const totalPiglet = await totalPigletCountDB();
    const medicineStockCount = await medicineStockCountDB();
    const feedStockCount = await feedStockCountDB();

    return res.status(200).json({
      status: "ok",
      data: {
        totalFemaleCount,
        totalMaleCount,
        totalPiglet,
        medicineStockCount,
        feedStockCount,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

export const totalMalePigCount = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const totalMaleCount = await totalMalePigCountDB();
    return res.status(200).json({ status: "ok", data: totalMaleCount });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

export const totalFemalePigCount = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const totalFemaleCount = await totalFemalePigCountDB();
    return res.status(200).json({ status: "ok", data: totalFemaleCount });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

export const totalPigletCount = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const totalPiglet = await totalPigletCountDB();
    return res.status(200).json({ status: "ok", data: totalPiglet });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

export const medicineStockCount = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const medicineStockCount = await medicineStockCountDB();
    return res.status(200).json({ status: "ok", data: medicineStockCount });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

export const feedStockCount = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const feedStockCount = await feedStockCountDB();
    return res.status(200).json({ status: "ok", data: feedStockCount });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

export const feedMedicineGraph = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const feedGraphData = await feedGraphDB();
    const medicineGraphData = await medicineGraphDB();

    return res.status(200).json({ status: "ok", data: feedStockCount });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", error: error });
  }
});

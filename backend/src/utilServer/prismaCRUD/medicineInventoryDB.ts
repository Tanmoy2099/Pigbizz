import { prisma } from "../connectDB";
//@ts-ignore
import { medicine_inventory } from "@prisma/client";
import { AppError } from "../catchError";
import { errorHandlerDB } from "./dbErrorHandler";

export async function appendInventoryMedicineTransactionDataDB(value: any) {
  const data = await prisma.medicine_Inventory_Transaction.create({
    data: value,
  });
  return data;
}
export async function appendInventoryMedicineDataDB(value: any) {
  const { medicine_name, medicine_type } = value;
  let ifValueExist: medicine_inventory[] = [];
  try {
    ifValueExist = await prisma.medicine_inventory.findMany({
      //@ts-ignore
      where: { medicine_name, medicine_type },
    });
  } catch (error) {
    errorHandlerDB(error);
  }
  let data;
  try {
    if (ifValueExist.length > 0) {
      data = await prisma.medicine_inventory.update({
        //@ts-ignore
        where: { medicine_name },
        data: {
          cost: value.cost,
          quantity: ifValueExist[0].quantity + value.quantity,
        },
      });
    } else {
      data = await prisma.medicine_inventory.create({ data: value });
    }
  } catch (error) {
    errorHandlerDB(error);
  }

  return data;
}

export async function getAllInventoryMedicineDataDB(skip = 0, take = 100) {
  const data = await prisma.$queryRaw`
      SELECT mit.id, mit.medicine_name, mit.date, mit.medicine_type, mit.cost, mit.quantity
      FROM medicine_inventory_transactions AS mit
      JOIN Medicine_Inventory AS mi ON mi.medicine_name = mit.medicine_name
      LIMIT ${take} OFFSET ${skip * take}
    `;

  return data;
}

export async function getAllinventoryMedicineCountDB() {
  let data;
  data = await prisma.medicine_Inventory_Transaction.count();
  return data;
}

export async function updateInventoryMedicineTransactionDataDB(
  id: number,
  value: any
) {
  const existingData = await prisma.medicine_Inventory_Transaction.findFirst({
    where: { id },
  });
  const inventoryData = await prisma.medicine_inventory.findUnique({
    where: { medicine_name: value.medicine_name },
  });
  if (
    (existingData && Object.keys(existingData).length === 0) ||
    (inventoryData && Object.keys(inventoryData).length === 0)
  ) {
    throw new AppError(402, "No data to update");
  }
  const updatedQuantity =
    inventoryData?.quantity! - existingData?.quantity! + value.quantity;
  if (typeof updatedQuantity === "number" && updatedQuantity >= 0) {
    await prisma.medicine_Inventory_Transaction.update({
      where: { id },
      data: value,
    });
    await prisma.medicine_inventory.update({
      where: { medicine_name: value.medicine_name },
      data: {
        medicine_name: value.medicine_name,
        cost: value.cost,
        quantity: updatedQuantity,
      },
    });

    const data = await prisma.$queryRaw`
      SELECT mit.id, mit.medicine_name, mit.date, mit.medicine_type, mit.cost, mit.quantity
      FROM medicine_inventory_transactions AS mit
      JOIN medicine_inventory AS mi ON mi.medicine_name = mit.medicine_name WHERE mit.id = ${id}
    `;
    return data;
  } else {
    throw new AppError(401, "Please submit valid data");
  }
}

export async function deleteInventoryMedicineDataDB(id: number) {
  const existingData = await prisma.medicine_Inventory_Transaction.findUnique({
    where: { id },
  });
  if (!existingData) {
    throw new AppError(402, "No data to delete");
  }
  const inventoryData = await prisma.medicine_inventory.findUnique({
    where: { medicine_name: existingData?.medicine_name },
  });

  if (!inventoryData) {
    throw new AppError(402, "No data to delete");
  }

  const updatedQuantity = inventoryData.quantity - existingData.quantity;
  if (updatedQuantity < 0)
    throw new AppError(402, "Updated quantity cannot be lower than 0");

  await prisma.medicine_inventory.update({
    where: { medicine_name: existingData.medicine_name },
    data: {
      quantity: updatedQuantity,
    },
  });

  const data = await prisma.medicine_Inventory_Transaction.delete({
    where: { id },
  });
  return data;
}

export async function getAllInventoryMedicineName() {
  const data = await prisma.medicine_inventory.findMany({
    select: {
      id: true,
      medicine_name: true,
      medicine_type: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return data;
}

export async function checkMedicineNameInInventory(medicine_name: string) {
  const data = await prisma.medicine_inventory.findMany({
    where: { medicine_name },
  });
  return data.length > 0 ? true : false;
}

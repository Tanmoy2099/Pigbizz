import type { MedicineUpdateData } from "../../types/medicine";
import { prisma } from "../connectDB";

async function addMedicineDataDB(incomingData: any) {
  const data = await prisma.assign_medicine.create({ data: incomingData });
  return data;
}
async function addEmergencyMedicineDataDB(incomingData: any) {
  const data = await prisma.assign_medicine.create({ data: incomingData });
  return data;
}

async function getAllMedicineDataPaginatedDB(
  skip = 0,
  take = 100,
  filter: string = ""
) {
  let data;
  let group = null;
  let where = {};
  if (filter === "pending" || filter === "complete") {
    where = { status: filter };
  }
  let query = { orderBy: {}, where, skip: skip * take, take };
  // if (Object.keys(where).length > 0) {
  //   query.where = where
  // }
  query.orderBy = { updatedAt: "desc" };
  data = await prisma.assign_medicine.findMany(query);
  return data;
}

async function getMedicineByTypeDB(medicineType: string) {
  const data = await prisma.medicine_inventory.findMany({
    where: {
      medicine_type: medicineType,
    },
  });
  return data;
}

async function getMedicineDataDB(id: number) {
  let data;
  data = await prisma.assign_medicine.findUnique({
    where: { id },
  });
  return data;
}

async function getAllAssignedMedicineCountDB() {
  let data;
  data = await prisma.assign_medicine.count();
  return data;
}

async function updateMedicineDataDB(
  id: number,
  medicineData: MedicineUpdateData
) {
  const data = await prisma.assign_medicine.update({
    where: { id },
    data: medicineData,
  });
  return data;
}

async function deleteMedicineDataDB(id: number) {
  const data = await prisma.assign_medicine.delete({ where: { id } });
  return data;
}

async function getAllMedicineTypeDB() {
  const data = await prisma.medicine_Type.findMany();
  return data;
}
async function getAMedicineTypeDB(value: string) {
  const data = await prisma.medicine_Type.findMany({
    where: { type: value },
  });
  return data;
}

async function addMedicineTypeDB(incomingData: string) {
  const data = await prisma.medicine_Type.create({
    data: { type: incomingData },
  });
  return data;
}

async function runningOutMedicineDB(limitValue: number) {
  const data = await prisma.medicine_inventory.findMany({
    where: { quantity: { lt: limitValue } },
  });
  // let runningOutItems= 0;
  // data.forEach(val=> {  })
  return data.length;
}

async function stockLeftDB() {
  let data = await prisma.medicine_inventory.findMany();
  let totalStock = 0;
  data.forEach((val) => {
    totalStock += val.quantity;
  });
  return totalStock;
}

export {
  addEmergencyMedicineDataDB,
  addMedicineDataDB,
  addMedicineTypeDB,
  deleteMedicineDataDB,
  getAMedicineTypeDB,
  getAllAssignedMedicineCountDB,
  getAllMedicineDataPaginatedDB,
  getAllMedicineTypeDB,
  getMedicineByTypeDB,
  getMedicineDataDB,
  runningOutMedicineDB,
  stockLeftDB,
  updateMedicineDataDB,
};

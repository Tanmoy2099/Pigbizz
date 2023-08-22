import type { PigData } from "../../types/pigData";
import { prisma } from "../../utilServer/connectDB";

async function createPigDetails(pigData: PigData) {
  const data = await prisma.pig_details.create({
    // @ts-ignore
    data: pigData,
  });

  return data;
}
async function updatePigDetails(pigData: any) {
  //TODO: fix it here
  // console.log(pigData.id, 'updatePigDetails 14');
  const id = pigData.id;
  // const id = parseInt(pigData.id);
  delete pigData.id;
  // delete pigData.createdAt
  // delete pigData.updatedAt

  const data = await prisma.pig_details.update({
    where: {
      id: id,
    },
    // @ts-ignore
    data: pigData,
  });

  return data;
}

async function updatePigDetailsByIdDB(pigId: string) {
  const data = await prisma.pig_details.update({
    where: {
      id: parseInt(pigId),
    },
    data: {
      sold: true,
    },
  });

  return data;
}

async function deletePig(uniqueId: string) {
  const data = await prisma.pig_details.delete({
    where: {
      unique_id: uniqueId,
    },
  });

  return data;
}

async function getAllPigs(skip = 0, take: number) {
  const totalSkip = skip * take;

  const query = { orderBy: {}, skip: totalSkip, take };
  query.orderBy = { updatedAt: "desc" };
  const data = await prisma.pig_details.findMany(query);
  return data;
}

async function getUnsoldPigs() {
  const query = { orderBy: {}, where: {} };
  query.orderBy = { updatedAt: "desc" };
  query.where = { sold: false };

  const data = await prisma.pig_details.findMany(query);
  return data;
}

async function getAllPigsCount() {
  const data = await prisma.pig_details.count();
  return data;
}

async function batchExistDB(batch_no: string) {
  const data = await prisma.batch.findUnique({
    where: {
      batch: batch_no,
    },
  });

  return data;
}

async function editBatchDB(id: number, batch: string) {
  const data = await prisma.batch.update({ where: { id }, data: { batch } });
  return data;
}

async function batchExistByIdDB(id: number) {
  const data = await prisma.batch.findUnique({ where: { id: id } });
  return data;
}

async function addBatchDB(batch: string) {
  const data = await prisma.batch.create({
    data: { batch },
  });

  return data;
}
async function turnBatchActiveDB(batch: string) {
  const data = await prisma.batch.update({
    where: { batch },
    data: { isActive: true },
  });

  return data;
}

async function deleteBatchDB(batch: string) {
  // const data = await prisma.batch.delete({
  //     where: { batch }
  // })
  const data = await prisma.batch.update({
    where: { batch },
    data: { isActive: false },
  });

  return data;
}

async function getAllBatchCountDB() {
  const data = await prisma.batch.count({ where: { isActive: true } });
  return data;
}

async function getAllBatchDB(skip = 0, take = 100) {
  // const data = await prisma.batch.findMany({ where: { isActive: true }, orderBy: { updatedAt: 'desc' }, skip: skip * take, take });
  const data = await prisma.batch.findMany({
    where: { isActive: true },
    skip: skip * take,
    take,
  });

  console.log(data, "pigDetails 118");

  return data;
}

async function pigsPerBatchDB(batch: string) {
  const data = await prisma.pig_details.findMany({
    where: { batch_no: batch },
  });
  return data;
}
async function getTagNoDB(tag_no: string) {
  const data = await prisma.pig_details.findMany({
    where: { tag_no },
  });
  return data;
}

async function getTagsDB() {
  //@ts-ignore
  const val = await prisma.pig_details.findMany({
    // where: { sold: false },
    select: { tag_no: true },
  });
  const data = val.map((v) => v.tag_no);
  return data;
}

async function batchUpdateDB(batch: string) {
  //@ts-ignore
  const data = await prisma.batch.update({ where: { batch } });
  return data;
}

async function getBatchDB(batch: string) {
  //@ts-ignore
  const data = await prisma.batch.findFirst({ where: { batch } });
  return data;
}

async function createNotificationDB(
  pigId: number,
  userId: number,
  day: number
) {
  const data = await prisma.notifications.create({
    data: {
      pig_id: pigId,
      user_id: userId,
      day: day,
    },
  });

  return data;
}

async function fetchNotificationDB() {
  const data = await prisma.notifications.findMany();

  return data;
}

async function soldPigsDB(pigId: string, price: number) {
  const data = await prisma.soldPigs.upsert({
    where: { unique_id: pigId },
    create: { unique_id: pigId, price: price, sold_date: new Date() },
    update: { price: price, sold_date: new Date() }
  });
  return data;
}



async function getASoldPigsDB(pigId: string) {
  const data = await prisma.soldPigs.findUnique({
    where: { unique_id: pigId }
  });
  return data;
}

async function deleteSoldPigsDB(pigId: string) {
  const data = await prisma.soldPigs.delete({
    where: { unique_id: pigId }
  });
  return data;
}

async function getSoldPigsDB() {
  const data = await prisma.soldPigs.findMany({
    include: {
      pig_details: true,
    },
  });
  return data;
}

async function getPigByGenderDB() {
  let female = await prisma.pig_details.findMany({
    where: {
      gender: "female",
    },
    select: {
      unique_id: true,
    },
  });
  let male = await prisma.pig_details.findMany({
    where: {
      gender: "male",
    },
    select: {
      unique_id: true,
    },
  });
  male = male.map((value) => value.unique_id) as any;
  female = female.map((value) => value.unique_id) as any;
  return { female, male };
}

export {
  addBatchDB,
  batchExistByIdDB,
  batchExistDB,
  batchUpdateDB,
  createNotificationDB,
  createPigDetails,
  deleteBatchDB,
  deletePig,
  editBatchDB,
  fetchNotificationDB,
  getAllBatchCountDB,
  getAllBatchDB,
  getAllPigs,
  getAllPigsCount,
  getBatchDB,
  getPigByGenderDB,
  getSoldPigsDB,
  getASoldPigsDB,
  getTagNoDB,
  getTagsDB,
  getUnsoldPigs,
  pigsPerBatchDB,
  soldPigsDB,
  deleteSoldPigsDB,
  turnBatchActiveDB,
  updatePigDetails,
  updatePigDetailsByIdDB,
};

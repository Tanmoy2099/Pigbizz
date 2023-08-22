import { prisma } from "../connectDB";

export const totalMalePigCountDB = async () => {
  const maleCount = await prisma.pig_details.count({
    where: {
      gender: "male",
      sold: false
    },
  });
  return maleCount;
};

export const totalFemalePigCountDB = async () => {
  const femaleCount = await prisma.pig_details.count({
    where: {
      gender: "female",
      sold: false
    },
  });
  return femaleCount;
};

export const totalPigletCountDB = async () => {
  const pigletCount = await prisma.pig_details.count({ where: { sold: false } });
  return pigletCount;
};

export const medicineStockCountDB = async () => {
  const lowMedicineCount = await prisma.setting.findMany({
    select: {
      low_medicine_parameter: true,
    },
  });

  const medicineStockCount = await prisma.medicine_inventory.count({
    where: {
      quantity: {
        lt: lowMedicineCount[0]["low_medicine_parameter"],
      },
    },
  });
  return medicineStockCount;
};


export const feedStockCountDB = async () => {
  const lowFeedCount = await prisma.setting.findMany({
    select: {
      low_feed_parameter: true,
    },
  });

  const feedStockCount = await prisma.feed_inventory.count({
    where: {
      quantity: {
        lt: lowFeedCount[0]["low_feed_parameter"],
      },
    },
  });
  return feedStockCount;
};

//TODO: add medicine graph
export const medicineGraphDB = async () => {



  return
};

//TODO: add feed graph
export const feedGraphDB = async () => {

  
  return
};
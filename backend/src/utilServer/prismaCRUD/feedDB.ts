import { FeedPlaner } from "../../types/feed";
import { prisma } from "../../utilServer/connectDB";

export async function addFeedDB(value: FeedPlaner) {
  //@ts-ignore
  const data = await prisma.feed_Planer.create({ data: value });
  return data;
}

export async function updateFeedDB(id: number, value: any) {
  //@ts-ignore
  const data = await prisma.feed_Planer.update({ where: { id }, data: value });
  return data;
}

export async function getAFeedDB(val: any) {
  const data = await prisma.feed_Planer.findMany({ where: { [val]: val } });
  return data[0];
}

export async function getFeedDB(skip = 0, take = 100) {
  let data;
  data = await prisma.feed_Planer.findMany({
    orderBy: { updatedAt: "desc" },
    skip: skip * take,
    take,
  });

  return data;
}

export async function getFeedCountDB() {
  let data = await prisma.feed_Planer.count();
  return data;
}

export async function deleteFeedDB(id: number) {
  let data = await prisma.feed_Planer.delete({ where: { id } });
  return data;
}

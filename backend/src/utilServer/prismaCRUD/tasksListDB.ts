import { prisma } from "../connectDB";

export const getTaskListDB = async (userId: string, skip = 0, take: number) => {
  const thedate = new Date();
  const newDate = thedate.setHours(0, 0, 0, 0);

  const totalSkip = skip * take;

  const notification = await prisma.notifications.findMany({
    where: {
      user_id: parseInt(userId),
      updatedAt: {
        gte: new Date(newDate),
      },
    },
    include: {
      user: {
        select: { id: true, email: true, phone: true, name: true }
      },
    },
    orderBy: { updatedAt: "desc" },
    skip: totalSkip,
    take: take,
  });

  return notification;
};

export const getTaskListCount = async () => {
  return await prisma.notifications.count();
};

export const getAssignedTaskListDB = async (skip = 0, take: number) => {

  const totalSkip = skip * take;

  const data = await prisma.assignTask.findMany({
    include: {
      assignee: {
        select: { id: true, email: true, phone: true, name: true }
      },
      assigned: {
        select: { id: true, email: true, phone: true, name: true }
      },
    },
    orderBy: { updatedAt: "desc" },
    skip: totalSkip,
    take: take,

  })
  return data
}

export const getUserTaskListDB = async (userId: number, skip = 0, take: number) => {

  const totalSkip = skip * take;

  const data = await prisma.assignTask.findMany({
    where: {
      assigned_id: userId
    },
    include: {
      assignee: {
        select: { id: true, email: true, phone: true, name: true }
      },
      assigned: {
        select: { id: true, email: true, phone: true, name: true }
      },
    },
    orderBy: { updatedAt: "desc" },
    skip: totalSkip,
    take: take,

  })
  return data
}

export const getAssignedTaskListCount = async () => await prisma.assignTask.count();
export const getUserTaskListCount = async (id: number) => await prisma.assignTask.count({
  where: { assigned_id: id }
});


export async function addTaskDB(data: any, id: number = -1) {

  const where = { id }
  const createOrUpdate = { ...data }

  return (await prisma.assignTask.upsert({
    where,
    create: createOrUpdate,
    update: createOrUpdate,
    include: {
      assignee: {
        select: { id: true, email: true, phone: true, name: true }
      },
      assigned: {
        select: { id: true, email: true, phone: true, name: true }
      },
    }
  }))
}
export async function getATaskDB(id: number) {
  return (await prisma.assignTask.findUnique({ where: { id } }));
}


export async function deleteATaskDB(id: number) {
  return (await prisma.assignTask.delete({ where: { id } }));
}
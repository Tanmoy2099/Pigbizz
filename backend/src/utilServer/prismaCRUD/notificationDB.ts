import { prisma } from "../connectDB";

export const findNotificationByUserIdDB = async (userId: string) => {
  const notification = await prisma.notifications.findMany({
    where: {
      user_id: parseInt(userId),
    },
  });

  return notification;
};


export const findNotificationByUserIdCurrentDayDB = async (userId: string) => {
  const notification = await prisma.notifications.findMany({
    where: {
      updatedAt: {
        gte: new Date(),
      },
      user_id: parseInt(userId),
    },
  });

  return notification;
};

export const addNotificationDB = async (data: { task_id: number, user_id: number, message: string }) => {
  const notification = await prisma.notifications.create({
    data: {
      task_id: +data.task_id,
      user_id: +data.user_id,
      message: data.message
    }
  });
  return notification;
}

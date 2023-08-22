import { prisma } from "../connectDB";

async function getUserDB() {
  const data = await prisma.user.findMany({ where: { isAdmin: false }, select: { id: true, email: true, name: true, phone: true } });
  return data;
};

async function getUniqueUserDB(id: number, isAdmin: Boolean = false) {
  //@ts-ignore
  const data = await prisma.user.findUnique({ where: { id: id, isAdmin: isAdmin } });
  return data;
};


export { getUserDB, getUniqueUserDB };

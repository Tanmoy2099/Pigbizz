
import { prisma } from "../../utilServer/connectDB";

async function getSettingDB() {
    //@ts-ignore
    const data = await prisma.setting.findMany();

    return data[0];
}

export { getSettingDB }

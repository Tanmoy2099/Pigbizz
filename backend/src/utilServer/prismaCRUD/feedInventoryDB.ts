import { Feed_Type, Feed_inventory } from "@prisma/client";
import { prisma } from "../connectDB"
import { errorHandlerDB } from "./dbErrorHandler";
import { AppError } from "../catchError";


export async function getAFeedTypeDB(value: string) {
    const data = await prisma.feed_Type.findUnique({
        where: { type: value }
    })
    return data
}

export async function getFeedTypeDB() {
    const data = await prisma.feed_Type.findMany()
    return data
}

export async function addFeedTypeDB(type: string) {
    const data = await prisma.feed_Type.create({ data: { type } })
    return data
}


export async function deleteType(type: any) {
    const data = await prisma.feed_Type.delete({ where: { type } })
    return data
}



export async function appendInventoryFeedTransactionDataDB(value: any) {
    const data = await prisma.feed_Inventory_Transaction.create({ data: value });
    return data;
}

export async function appendInventoryFeedDataDB(value: any) {
    const { feed_name, feed_type } = value
    let ifValueExist: Feed_inventory[] = [];
    try {
        ifValueExist = await prisma.feed_inventory.findMany({
            //@ts-ignore
            where: { feed_name, feed_type }
        })
    } catch (error) {
        errorHandlerDB(error)
    }
    let data;
    try {
        if (ifValueExist.length > 0) {
            data = await prisma.feed_inventory.update({
                //@ts-ignore
                where: { feed_name },
                data: {
                    cost: value.cost,
                    quantity: ifValueExist[0].quantity + value.quantity
                }
            })
        } else {
            data = await prisma.feed_inventory.create({ data: value })
        }
    } catch (error) {
        errorHandlerDB(error)
    }

    return data;
}

export async function getAllInventoryFeedDataDB(skip = 0, take = 100) {

    const data = await prisma.$queryRaw`
      SELECT mit.id, mit.feed_name, mit.date, mit.feed_type, mit.cost, mi.quantity
      FROM feed_inventory_transactions AS mit
      JOIN Feed_Inventory AS mi ON mi.feed_name = mit.feed_name
      LIMIT ${take} OFFSET ${skip * take}
    `;

    return data;
}


export async function getAllinventoryAssignedFeedCountDB() {
    let data;
    data = await prisma.feed_Inventory_Transaction.count()
    return data;
}


export async function updateInventoryFeedTransactionDataDB(id: number, value: any) {

    // changing name is not allowed
    const existingData = await prisma.feed_Inventory_Transaction.findFirst({ where: { id } })
    const inventoryData = await prisma.feed_inventory.findUnique({ where: { feed_name: value.feed_name } })
    if (!inventoryData) throw new AppError(401, "Please keep the name same")
    if ((existingData && Object.keys(existingData).length === 0) || (inventoryData && Object.keys(inventoryData).length === 0)) {
        throw new AppError(402, "No data to update");
    }
    const updatedQuantity = (inventoryData?.quantity! - existingData?.quantity! + value.quantity)
    if (typeof updatedQuantity === 'number' && updatedQuantity >= 0) {

        await prisma.feed_Inventory_Transaction.update({
            where: { id },
            data: value
        });
        await prisma.feed_inventory.update({

            where: { feed_name: value.feed_name },
            data: {
                feed_name: value.feed_name,
                cost: value.cost,
                quantity: updatedQuantity,
            }
        })

        const data = await prisma.$queryRaw`
      SELECT mit.id, mit.feed_name, mit.date, mit.feed_type, mit.cost, mit.quantity
      FROM feed_inventory_transactions AS mit
      JOIN feed_inventory AS mi ON mi.feed_name = mit.feed_name WHERE mit.id = ${id}
    `;
        return data;
    } else { throw new AppError(401, "Please submit valid data") }

}


export async function deleteInventoryFeedDataDB(id: number) {
    const existingData = await prisma.feed_Inventory_Transaction.findUnique({ where: { id } })
    if (!existingData) {
        throw new AppError(402, "No data to delete");
    }
    const inventoryData = await prisma.feed_inventory.findUnique({ where: { feed_name: existingData?.feed_name } })

    if (!inventoryData) {
        throw new AppError(402, "No data to delete");
    }

    const updatedQuantity = (inventoryData.quantity - existingData.quantity)
    if (updatedQuantity < 0) throw new AppError(402, "Updated quantity cannot be lower than 0");

    await prisma.feed_inventory.update({

        where: { feed_name: existingData.feed_name },
        data: {
            quantity: updatedQuantity,
        }
    })


    const data = await prisma.feed_Inventory_Transaction.delete({ where: { id } });
    return data
}


export async function getAllInventoryFeedName() {
    const data = await prisma.feed_inventory.findMany({
        select: {
            id: true,
            feed_name: true,
            feed_type: true
        },
        orderBy: { updatedAt: 'desc' }
    })
    return data;
}
export async function checkFeedNameInInventory(feed_name: string) {
    const data = await prisma.feed_inventory.findMany({ where: { feed_name } })
    return data.length > 0 ? true : false;
}
import { prisma } from "../connectDB";




export async function getCostTypeDB() {
    const data = await prisma.cost_Type.findMany()
    return data
}


export async function getACostTypeDB(value: string) {
    const data = await prisma.cost_Type.findUnique({ where: { type: value } })
    return data?.type
}

export async function postExpenseDataDB(value: any) {
    const data = await prisma.expense.create({ data: value })
    return data;
}

export async function putExpenseDataDB(value: any) {
    const id = +value.id
    delete value.id
    const data = await prisma.expense.update({ where: { id }, data: value })
    return data;
}


//-------------------------------------------
export async function getExpenseDB(skip = 0, take = 100, month = 0) {
    let data;
    let currentYear = new Date().getFullYear();
    let where = {};
    if (month > 0) {
        const currentMonth = month > 9 ? month : `0${month}`
        const minDate = new Date(`${currentYear}-${currentMonth}-01`);
        const maxDate = month === 12 ? new Date(`${currentYear + 1}-12-01`) : new Date(`${currentYear}-${month + 1}-01`);

        console.log(minDate, currentMonth);

        where = {
            date: {
                gte: minDate,
                lt: maxDate
            }
        }
    }

    data = await prisma.expense.findMany({
        where: where,
        orderBy: { updatedAt: 'desc' },
        skip: skip * take,
        take
    });

    return data;
}

export async function getExpenseCountDB(month = 0) {
    let currentYear = new Date().getFullYear();
    let where = {};
    if (month > 0) {
        const currentMonth = month > 9 ? month : `0${month}`
        const minDate = new Date(`${currentYear}-${currentMonth}-01`);
        const maxDate = month === 12 ? new Date(`${currentYear + 1}-12-01`) : new Date(`${currentYear}-${month + 1}-01`);
        where = {
            date: {
                gte: minDate,
                lt: maxDate
            }
        }
    }
    let data = await prisma.expense.count({ where: where })
    return data;
}

export async function deleteExpenseDB(id: number) {
    let data = await prisma.expense.delete({ where: { id } })
    return data;
}
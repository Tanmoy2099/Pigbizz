import { prisma } from "../../utilServer/connectDB";

// export async function getSoldPigsDB(skip = 0, take: number) {
//     const data = await prisma.soldPigs.findMany({
//         where: {}
//     })

//     return data;
// }

export async function getSoldPigsDB(skip = 0, take = 100, month = 0) {
    let data;
    // let currentYear = new Date().getFullYear();
    let where = {};

    // if (month > 0) {
    //     const currentMonth = month > 9 ? month : `0${month}`
    //     const minDate = new Date(`${currentYear}-${currentMonth}-01`);
    //     const maxDate = month === 12 ? new Date(`${currentYear + 1}-12-01`) : new Date(`${currentYear}-${month + 1}-01`);

    //     console.log(minDate, currentMonth);

    //     where = {
    //         date: {
    //             gte: minDate,
    //             lt: maxDate
    //         }
    //     }
    // }

    data = await prisma.soldPigs.findMany({
        where: where,
        orderBy: { updatedAt: 'desc' },
        skip: skip * take,
        take,
        include: {
            pig_details: true,
        },
    });

    return data;
}

export async function getTotalSellDB() {
    let data;
    let where = {};

    // data = await prisma.soldPigs.findMany({ where, orderBy: { updatedAt: 'desc' } });

    //TODO: add condition if needed
    data = await prisma.soldPigs.aggregate({
        //   _groupBy: {
        //     sold_date: {
        //       year: true,
        //       month: true
        //     }
        // },
        _sum: {
            price: true
        }
    });

    return data;
}
export async function getTotalSellGenderDB() {
    let data: { male: number, female: number, piglet: number };
    let where = {

    };

    // data = await prisma.soldPigs.findMany({ where, orderBy: { updatedAt: 'desc' } });

    interface SoldPig {
        pig_details: {
            gender: string;
        } | null;
        price: number;
    }

    const soldPigsWithDetails: SoldPig[] = await prisma.soldPigs.findMany({
        include: {
            pig_details: true,
        },
    });

    const value: Record<string, number> = soldPigsWithDetails.reduce((result: any, soldPig: any) => {
        const gender = soldPig.pig_details?.gender || 'Unknown';

        if (!result[gender]) {
            result[gender] = 0;
        }

        result[gender] += soldPig.price;
        return result;
    }, {});

    const totalPigletSales: number = soldPigsWithDetails.reduce((result, soldPig) => {
        result += soldPig.price;
        return result;
    }, 0);

    return { ...value, piglet: totalPigletSales };

}

export async function getSoldPigsCountDB(month = 0) {
    // let currentYear = new Date().getFullYear();
    let where = {};


    // if (month > 0) {
    //     const currentMonth = month > 9 ? month : `0${month}`
    //     const minDate = new Date(`${currentYear}-${currentMonth}-01`);
    //     const maxDate = month === 12 ? new Date(`${currentYear + 1}-12-01`) : new Date(`${currentYear}-${month + 1}-01`);
    //     where = {
    //         date: {
    //             gte: minDate,
    //             lt: maxDate
    //         }
    //     }
    // }
    let data = await prisma.soldPigs.count({ where: where })
    return data;
}

export async function getUniqueSoldPigsDB(id: any) {
    let data = await prisma.soldPigs.findMany({ where: { unique_id: id.toLowerCase() }, include: { pig_details: true } })
    return data;
}


export async function getWeeklyOverviewDB() {
    const currentDate = new Date();
    const sevenDays = [1, 2, 3, 4, 5, 6, 7];
    let lastSevenDates: any = {};

    for (let val of sevenDays) {

        const data = (await prisma.soldPigs.aggregate({
            where: {
                sold_date: {
                    gte: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() - +val,
                    ),
                    lt: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() - +val + 1,
                    ),
                }
            },
            _sum: {
                price: true,
            },
        }));
        console.log(data?._sum?.price);

        lastSevenDates[`day${val}`] = data?._sum?.price ?? 0;
    }
    return lastSevenDates
}
// export async function getWeeklyOverviewDB() {
//     let data;
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth();
//     const currentDay = currentDate.getDay();
//     const sevenDays = [1, 2, 3, 4, 5, 6, 7];

//     // let lastSevenDays: any = {}
//     let lastSevenDates: any = []

//     // sevenDays.forEach((val: number) => { lastSevenDays[val] = currentDay - 1 })


//     // if (currentDay < 8) {

//     // }
//     sevenDays.forEach(async (val: number) => {
//         const data = (await prisma.soldPigs.aggregate({
//             where: {
//                 sold_date: new Date(currentYear, currentMonth, currentDay - val), // End of the current year
//             },
//             _sum: {
//                 price: true,
//             },
//         }));
//         lastSevenDates.push(data)
//         console.log(data);
//     })

//     return lastSevenDates;
// }

export async function getCostsDB() {
    let data: { medicine: number, feed: number, crew: number, profitOrLoss: number } = { medicine: 0, feed: 0, crew: 0, profitOrLoss: 0 };
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    let result = await prisma.medicine_Inventory_Transaction.aggregate({
        where: {
            date: {
                gte: new Date(currentYear, 0, 1), // Start of the current year
                lte: new Date(currentYear, 11, 31), // End of the current year
            },
        },
        _sum: {
            cost: true,
        },
    });

    data.medicine = result._sum.cost || 0;


    result = await prisma.feed_Inventory_Transaction.aggregate({
        where: {
            date: {
                gte: new Date(currentYear, 0, 1), // Start of the current year
                lte: new Date(currentYear, 11, 31), // End of the current year
            },
        },
        _sum: {
            cost: true,
        },
    });
    data.feed = result._sum.cost || 0;


    result = await prisma.expenses.aggregate({
        where: {
            date: {
                gte: new Date(currentYear, 0, 1), // Start of the current year
                lte: new Date(currentYear, 11, 31), // End of the current year
            },
        },
        _sum: {
            cost: true,
        },
    });

    data.crew = result._sum?.cost || 0;

    const curYearPigProfit: number | null = (await prisma.soldPigs.aggregate({
        where: {
            sold_date: {
                gte: new Date(currentYear, 0, 1), // Start of the current year
                lte: new Date(currentYear, 11, 31), // End of the current year
            },
        },
        _sum: {
            price: true,
        },
    }))._sum.price;

    if (curYearPigProfit)
        data.profitOrLoss = curYearPigProfit - (data.crew + data.feed + data.medicine)


    return data;
}




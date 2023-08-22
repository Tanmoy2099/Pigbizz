import { prisma } from "../connectDB";



export async function appendEmergencyMedicineDataDB(incomingData: any) {
    const data = await prisma.emergency_medicine_data.create({ data: incomingData });

    return data;
}

export async function getAllEmergencyMedicineDataDB(skip = 0, take = 100) {
    let data;
    const query = { orderBy: {}, skip: skip * take, take };
    query.orderBy = { updatedAt: 'desc' };
    data = await prisma.emergency_medicine_data.findMany(query);
    return data;
}


export async function getAllEmergencyMedicineCountDB() {
    let data;
    data = await prisma.emergency_medicine_data.count()
    return data;
}

export async function getEmergencyMedicineDataDB(id: number) {
    let data;
    data = await prisma.emergency_medicine_data.findUnique({
        where: { id }
    })
    return data;
}

export async function updateEmergencyMedicineDataDB(id: number, medicineData: any) {
    const data = await prisma.emergency_medicine_data.update({
        where: { id },
        data: medicineData
    })
    return data;
}


export async function deleteEmergencyMedicineDataDB(id: number) {
    const data = await prisma.emergency_medicine_data.delete({ where: { id } });
    return data
}

// export default { appendEmergencyMedicineDataDB }
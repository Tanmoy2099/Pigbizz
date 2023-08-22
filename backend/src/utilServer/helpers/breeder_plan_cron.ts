import { breederAndLactationFeedingPlanDB } from "../prismaCRUD/feedingPlanDB";
import { addNotificationDB } from "../prismaCRUD/notificationDB";
import {
    createNotificationDB,
    getUnsoldPigs,
    updatePigDetails,
} from "../prismaCRUD/pigDetailsDB";
import { addTaskDB } from "../prismaCRUD/tasksListDB";
import { getUserDB } from "../prismaCRUD/userDB";

export const breederPlanCron = async () => {
    const data = await getUnsoldPigs();
    const users = await getUserDB();

    //TODO: update this if farm users become more than one
    if (users.length != 0) {
        data.forEach(async (pig, index) => {
            const userId = users[0]["id"]
            await addToAssignTask(pig, pig.tag_no, userId)
        });
    };
};

// TODO: auto assign jobs 
async function addToAssignTask(pig: any, tagNo: string, userId: number) {
    try {
        const feedingData = (await breederAndLactationFeedingPlanDB(pig.id))[0];
        const task = `Feed Breeder and Lactation to pig with the tag no: ${tagNo}`;
        let remark = ``;

        //@ts-ignore
        if (feedingData?.feedType) { remark += `Feed Type: ${feedingData?.feedType}, ` + "\n" }
        //@ts-ignore
        if (feedingData?.quantity) { remark += `Quantity ${feedingData?.quantity}, ` + "\n" }

        const dataToSend: any = { assigned_id: userId, task, remark }

        const taskRes = await addTaskDB(dataToSend);
        await addNotificationDB({ task_id: +taskRes.id, user_id: userId, message: task })
    } catch (error) {
        console.log(error);
        return false
    }
}

import { birthToFinishMedicinePlanDB } from "../prismaCRUD/feedingPlanDB";
import { addNotificationDB } from "../prismaCRUD/notificationDB";
import {
    createNotificationDB,
    getUnsoldPigs,
    updatePigDetails,
} from "../prismaCRUD/pigDetailsDB";
import { addTaskDB } from "../prismaCRUD/tasksListDB";
import { getUserDB } from "../prismaCRUD/userDB";

export const medicinePlanCron = async () => {
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
        const feedingData = (await birthToFinishMedicinePlanDB(pig.id))[0];
        const task = `Give Medicine to pig with the tag no: ${tagNo}`;
        let remark = ``;

        //@ts-ignore
        if (feedingData?.dose) { remark += `Dose: ${feedingData?.dose}, ` }
        //@ts-ignore
        if (feedingData?.ml) { remark += ` ${feedingData?.ml}, ` }
        //@ts-ignore
        if (feedingData?.im_subcut_oral) { remark += ` ${feedingData?.im_subcut_oral}, ` + "\n" }
        //@ts-ignore
        if (feedingData?.brand) { remark += `Brand: ${feedingData?.brand}, ` + "\n" }

        const dataToSend: any = { assigned_id: userId, task, remark }

        const taskRes = await addTaskDB(dataToSend);
        await addNotificationDB({ task_id: +taskRes.id, user_id: userId, message: task })
    } catch (error) {
        console.log(error);
        return false
    }
}

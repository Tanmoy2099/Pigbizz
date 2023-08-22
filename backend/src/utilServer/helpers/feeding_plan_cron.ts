import { birthToFinishFeedingPlanDB } from "../prismaCRUD/feedingPlanDB";
import { addNotificationDB } from "../prismaCRUD/notificationDB";
import {
  createNotificationDB,
  getUnsoldPigs,
  updatePigDetails,
} from "../prismaCRUD/pigDetailsDB";
import { addTaskDB } from "../prismaCRUD/tasksListDB";
import { getUserDB } from "../prismaCRUD/userDB";

export const feedingPlanCron = async () => {
  let updated: any[] = [];
  const data = await getUnsoldPigs();
  const users = await getUserDB();

  //TODO: update this if farm users become more than one
  if (users.length != 0) {
    for (let pig of data as any) {
      pig["days"] += 1;
      const update = await updatePigDetails(pig);
      updated.push(update);
    }
    updated.forEach(async (pig, index) => {
      const userId = users[0]["id"]
      await addToAssignTask(pig, pig.tag_no, userId)
      // await addNotificationDB({ task_id: +data.id, user_id: +assigned_id, message: task })
      // await createNotificationDB(pig["id"], userId, pig["days"]);
    });
  };
};

// TODO: auto assign jobs 
async function addToAssignTask(pig: any, tagNo: string, userId: number) {
  try {
    const feedingData = (await birthToFinishFeedingPlanDB(pig.id))[0];
    const task = `Feed pig with the tag no: ${tagNo}`;
    let remark = ``;

    //@ts-ignore
    if (feedingData?.colostrum) { remark += `colostrum: ${feedingData?.colostrum}, ` + "\n" }
    //@ts-ignore
    if (feedingData?.creepFeedGMS) { remark += `creep feedGMS: ${feedingData?.creepFeedGMS}, ` + "\n" }
    //@ts-ignore
    if (feedingData?.starterFeedGMS) { remark += `starter feedGMS: ${feedingData?.starterFeedGMS}, ` + "\n" }
    //@ts-ignore
    if (feedingData?.growerFeedGMS) { remark += `grower feedGMS: ${feedingData?.growerFeedGMS}, ` + "\n" }
    //@ts-ignore
    if (feedingData?.fisherFeedGMS) { remark += `fisher feedGMS: ${feedingData?.fisherFeedGMS}, ` + "\n" }
    //@ts-ignore
    if (feedingData?.expectedWeight) { remark += `expected weight: ${feedingData?.expectedWeight}, ` + "\n" }
    //@ts-ignore
    if (feedingData?.actualWeight) { remark += `actual weight: ${feedingData?.actualWeight} ` + "\n" }

    const dataToSend: any = { assigned_id: userId, task, remark }

    const taskRes = await addTaskDB(dataToSend);
    await addNotificationDB({ task_id: +taskRes.id, user_id: userId, message: task })
  } catch (error) {
    console.log(error);
    return false
  }
}

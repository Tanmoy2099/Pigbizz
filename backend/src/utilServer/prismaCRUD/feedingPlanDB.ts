import { prisma } from "../connectDB";

async function birthToFinishFeedingPlanDB(id: string) {
  const pigs = await prisma.pig_details.findMany({
    where: {
      id: parseInt(id),
      farrowing: true,
      sold: false
    },
  });
  let data: any[] = [];
  // @ts-ignore
  if (pigs.length != 0) {
    const pig = pigs[0]

    if (+pig["days"] <= 7) {
      console.log(pig["days"].toString());

      data = await prisma.birthToFinishFeedingPlan.findMany({
        where: {
          afterFarrowing: {
            // @ts-ignore
            contains: `Day ${+pig["days"].toString()}`,
          },
          // afterFarrowing: `Day ${pig["days"]}`,

        },
      });

      // return data;
      // @ts-ignore
      // } else if (pig["days"] > 7 && Math.ceil(pig["days"] <= 26 * 7)) {
    } else if (+pig["days"] > 7 && +pig["days"] <= 26 * 7) {
      // @ts-ignore
      const weekNumber = Math.ceil(+pig["days"] / 7);
      data = await prisma.birthToFinishFeedingPlan.findMany({
        where: {
          afterFarrowing: `Week ${weekNumber}`,
        },
      });
      // return data;
    } else {
      data = await prisma.birthToFinishFeedingPlan.findMany({
        where: {
          afterFarrowing: `Week 19`,
        },
      });

      // return data;
    }
  }
  return data;
}


// async function birthToFinishFeedingPlanForCurrentDayDB(id: string) {
//   const pig = await prisma.pig_details.findMany({
//     where: {
//       id: parseInt(id),
//       farrowing: true,
//     },
//   });

//   // @ts-ignore
//   if (pig.length != 0) {
//     // @ts-ignore
//     if (pig["days"] <= 7) {
//       const data = await prisma.birthToFinishFeedingPlan.findMany({
//         where: {
//           afterFarrowing: {
//             // @ts-ignore
//             contains: `Day ${pig["days"].toString()}`,
//           },
//         },
//       });
//       console.log("day");
//       return data;
//       // @ts-ignore
//     } else if (pig["days"] > 7 && Math.ceil(pig["days"] <= 26 * 7)) {
//       // @ts-ignore
//       const weekNumber = Math.ceil(pig["days"] / 7);
//       const data = await prisma.birthToFinishFeedingPlan.findMany({
//         where: {
//           afterFarrowing: {
//             contains: `Week ${weekNumber.toString()}`,
//           },
//         },
//       });
//       return data;
//     } else {
//       const data = await prisma.birthToFinishFeedingPlan.findMany({
//         where: {
//           afterFarrowing: {
//             contains: `Week 19`,
//           },
//         },
//       });
//       return data;
//     }
//   } else {
//     return [];
//   }
// }

async function birthToFinishMedicinePlanDB(id: string) {
  const pig = await prisma.pig_details.findUnique({
    where: {
      id: parseInt(id),
      sold: false
    },
  });
  // @ts-ignore
  if (+pig["days"] <= 83) {
    const data = await prisma.birthToFinishMedicinePlan.findMany({
      where: {
        // @ts-ignore
        day: pig["days"].toString(),
      },
    });
    return data;
  } else {
    const data = await prisma.birthToFinishMedicinePlan.findMany({
      where: {
        // @ts-ignore
        day: "83",
      },
    });
    return data;
  }
}

async function breederAndLactationFeedingPlanDB(id: string) {
  const pig = await prisma.pig_details.findUnique({
    where: {
      id: parseInt(id),
      sold: false
    },
  });
  // @ts-ignore
  if (pig["farrowing"] === true) {
    const data = await prisma.breederAndLactationFeedingPlan.findMany({
      where: {
        days: {
          // @ts-ignore
          contains: `Farrowing${pig["days"].toString()}`,
        },
      },
    });
    return data;
  } else {
    const data = await prisma.breederAndLactationFeedingPlan.findMany({
      where: {
        OR: [
          {
            days: {
              // @ts-ignore
              startsWith: `${pig["days"].toString()} to`,
            },
          },
          {
            days: {
              // @ts-ignore
              endsWith: `to ${pig["days"].toString()}`,
            },
          },
        ],
      },
    });
    return data;
  }
}

export {
  birthToFinishFeedingPlanDB,
  birthToFinishMedicinePlanDB,
  breederAndLactationFeedingPlanDB,
  // birthToFinishFeedingPlanForCurrentDayDB,
};

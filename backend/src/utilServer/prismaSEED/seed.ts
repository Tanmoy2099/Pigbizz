import { prisma } from "../connectDB";
import * as birthToFinishFeedingPlanJson from "./birth_to_finish_feeding_plan.json";
import * as birthToFinishMedicinePlanJson from "./birth_to_finish_medicine_plan.json";
import * as breederAndLactationFeedingPlanJson from "./breeder_feeding_plan.json";
import * as settings from "./settings.json";

const birthToFinishFeedingPlanSeed = async () => {
  let list = JSON.parse(JSON.stringify(birthToFinishFeedingPlanJson))[
    "default"
  ];

  for (let data of list) {
    await prisma.birthToFinishFeedingPlan.createMany({
      data: {
        afterFarrowing: data.afterFarrowing,
        colostrum: data.colostrum,
        day: data.day,
        creepFeedGMS: data.creepFeedGMS,
        starterFeedGMS: data.starterFeedGMS,
        growerFeedGMS: data.growerFeedGMS,
        fisherFeedGMS: data.finisherFeedGMS,
        expectedWeight: data.expectedWeight,
        actualWeight: data.actualWeight,
      },
    });
  }
};

const settingsSeed = async () => {
  await prisma.setting.create({
    data: {
      low_feed_parameter: settings.low_feed_parameter,
      low_medicine_parameter: settings.low_medicine_parameter,
      default_pagination_limit: settings.default_pagination_limit,
      small_list_pagination_limit: settings.small_list_pagination_limit,
    },
  });
};

const breederAndLactationFeedingPlan = async () => {
  let list = JSON.parse(JSON.stringify(breederAndLactationFeedingPlanJson))[
    "default"
  ];
  for (let data of list) {

    await prisma.breederAndLactationFeedingPlan.createMany({
      data: {
        days: data.days,
        quantity: data.quantity,
        feedType: data.feedType,
      },
    });
  }
};

const birthToFinishMedicinePlan = async () => {
  let list = JSON.parse(JSON.stringify(birthToFinishMedicinePlanJson))[
    "default"
  ];

  for (let data of list) {
    await prisma.birthToFinishMedicinePlan.createMany({
      data: {
        date: data.date,
        day: data.day,
        dose: data.dose,
        im_subcut_oral: data.imSubcutOral,
        ml: data.ml,
        brand: data.brand,
      },
    });
  }
};

// main
const main = async () => {
  console.log("Start seeding...");
  await birthToFinishFeedingPlanSeed();
  await settingsSeed();
  await breederAndLactationFeedingPlan();
  await birthToFinishMedicinePlan();
};

// execute
(async () => {
  await main()
    .then(() => {
      console.info("Finished seeding 🌱");
    })
    .catch((e) => {
      console.error(e);

      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
})();

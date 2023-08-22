import { NextFunction, Response } from "express";
import { catchAsync } from "../../utilServer/catchAsync";
import { AppError } from "../../utilServer/catchError";

import type { AuthRequest } from "../../types/authRequest";
import { PigData } from "../../types/pigData";
import { prisma } from "../../utilServer/connectDB";

import { v4 as uuidv4 } from "uuid";

import {
  addBatchDB,
  batchExistByIdDB,
  batchExistDB,
  batchUpdateDB,
  createPigDetails,
  deleteBatchDB,
  deletePig,
  deleteSoldPigsDB,
  editBatchDB,
  fetchNotificationDB,
  getASoldPigsDB,
  getAllBatchCountDB,
  getAllBatchDB,
  getAllPigs,
  getAllPigsCount,
  getBatchDB,
  getPigByGenderDB,
  getSoldPigsDB,
  getTagsDB,
  pigsPerBatchDB,
  soldPigsDB,
  turnBatchActiveDB,
  updatePigDetails,
  updatePigDetailsByIdDB,
} from "../../utilServer/prismaCRUD/pigDetailsDB";
// import { number } from "yup";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import {
  birthToFinishFeedingPlanDB,
  birthToFinishMedicinePlanDB,
  breederAndLactationFeedingPlanDB,
} from "../../utilServer/prismaCRUD/feedingPlanDB";

const convertToDateFormat = (date: string | Date, name: string) => {
  // let timestamp = Date.parse(date);
  // if (isNaN(timestamp) !== true) throw new AppError(400, `${name} is not a valid date`)
  // return new Date(timestamp);
  try {
    let d = new Date(date);
    if (!isNaN(d.getDate())) return d;
  } catch (error) {
    throw new AppError(400, `${name} is not a valid Date`);
  }
  return;
};

const isDate = (date: string | Date) => {
  let d = new Date(date);
  if (!isNaN(d.getDate())) return true;
  return false;
};

const requiredData = (data: any, name: string) => {
  if (data) return;
  throw new AppError(400, `${name} is required`);
};

// const assignIfValueExist = (data: any, container: any, name: string) => {
//   if (!data) return;
//   container[data] = convertToDateFormat(data, name);
// };

const pigAdd = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const uuidUID = uuidv4();
  const unique_id = uuidUID.toString().split("-").join("").slice(0, 8);
  const tag_no = uuidUID.toString().split("-").join("").slice(0, 8);

  const {
    breeding_details,
    // unique_id,
    // tag_no,
    age,
    weight,
    gender,
    fathers_tagNo,
    mothers_tagNo,
    predictive_pregnancy,
    sold,
    batch_no,
    grouping,
    is_ade3h_inj,
    expected_deworming_date,
    is_deworming,
    delivery_room_sentExpectedDate,
    is_deliveryRoomClean,
    expected_deliveryDate,
    expected_amoxcillin_powderDate,
    is_amoxicillin,
    expected_bitadinespray_date,
    is_bitadinespray,
    actual_deliverydate,
    no_ofPiglet,
    no_of_male,
    no_of_female,
    saw_id,
    boar_id,
    first_heatDate,
    second_heatDate,
    third_heatDate,
    first_crossingDate,
    is_rechockAfterFirstCrossingDate,
    second_crossingDate,
    expected_1stade3hInjDate,
    is_1stAde3h,
    expected_2ndade3hInjDate,
    date_of_lic_startedDate,
    is_2ndAde3h,
    whichPregnancy,
  } = req.body;
  // res.send(req.query.breeding_details);
  console.log(req.body); //TODO: no data coming in body

  requiredData(breeding_details, "breeding details");
  // requiredData(unique_id, "unique id");
  // requiredData(tag_no, "tag no");
  requiredData(age, "age");
  requiredData(weight, "weight");
  requiredData(gender, "gender");
  // requiredData(fathers_tagNo, "fathers tagNo");
  // requiredData(mothers_tagNo, "mothers tagNo");
  // requiredData(predictive_pregnancy, 'predictive pregnancy');
  requiredData(batch_no, "batch no");
  requiredData(grouping, "grouping");
  requiredData(expected_bitadinespray_date, "expected bitadinespray Date");
  requiredData(actual_deliverydate, "actual delivery Date");
  requiredData(first_crossingDate, "first crossing Date");

  const pigData: PigData = {
    breeding_details,
    unique_id,
    tag_no,
    age,
    weight,
    gender,
    fathers_tagNo,
    mothers_tagNo,
    predictive_pregnancy:
      predictive_pregnancy === true || predictive_pregnancy === "true"
        ? true
        : false,
    batch_no,
    grouping,
    is_ade3h_inj:
      is_ade3h_inj === true || is_ade3h_inj === "true" ? true : false,
    is_deworming:
      is_deworming === true || is_deworming === "true" ? true : false,
    is_deliveryRoomClean:
      is_deliveryRoomClean === true || is_deliveryRoomClean === "true"
        ? true
        : false,
    is_amoxicillin:
      is_amoxicillin === true || is_amoxicillin === "true" ? true : false,
    // expected_bitadinespray_date: new Date(expected_bitadinespray_date),
    // @ts-ignore
    expected_bitadinespray_date: convertToDateFormat(
      expected_bitadinespray_date,
      "expected bitadinespray date"
    ),
    is_bitadinespray:
      is_bitadinespray === true || is_bitadinespray === "true" ? true : false,
    // actual_deliverydate: new Date(actual_deliverydate),
    // @ts-ignore
    actual_deliverydate: convertToDateFormat(
      actual_deliverydate,
      "actual deliverydate"
    ),
    // first_crossingDate: new Date(first_crossingDate),
    // @ts-ignore
    first_crossingDate: convertToDateFormat(
      first_crossingDate,
      "first crossingDate"
    ),
    is_rechockAfterFirstCrossingDate:
      is_rechockAfterFirstCrossingDate === true ||
        is_rechockAfterFirstCrossingDate === "true"
        ? true
        : false,
    is_1stAde3h: is_1stAde3h === true || is_1stAde3h === "true" ? true : false,
    is_2ndAde3h: is_2ndAde3h === true || is_2ndAde3h === "true" ? true : false,
    whichPregnancy: whichPregnancy,
  };

  if (sold !== undefined)
    pigData.sold = sold === true || sold === "true" ? true : false;

  if (isDate(expected_deworming_date))
    pigData.expected_deworming_date = new Date(expected_deworming_date);
  if (isDate(delivery_room_sentExpectedDate))
    pigData.delivery_room_sentExpectedDate = new Date(
      delivery_room_sentExpectedDate
    );
  if (isDate(expected_deliveryDate))
    pigData.expected_deliveryDate = new Date(expected_deliveryDate);
  if (isDate(expected_amoxcillin_powderDate))
    pigData.expected_amoxcillin_powderDate = new Date(
      expected_amoxcillin_powderDate
    );
  if (isDate(first_heatDate)) pigData.first_heatDate = new Date(first_heatDate);
  if (isDate(second_heatDate))
    pigData.second_heatDate = new Date(second_heatDate);
  if (isDate(second_crossingDate))
    pigData.second_crossingDate = new Date(second_crossingDate);
  if (isDate(third_heatDate)) pigData.third_heatDate = new Date(third_heatDate);
  if (isDate(expected_1stade3hInjDate))
    pigData.expected_1stade3hInjDate = new Date(expected_1stade3hInjDate);
  if (isDate(expected_2ndade3hInjDate))
    pigData.expected_2ndade3hInjDate = new Date(expected_2ndade3hInjDate);
  if (isDate(date_of_lic_startedDate))
    pigData.date_of_lic_startedDate = new Date(date_of_lic_startedDate);

  if (no_ofPiglet) pigData.no_ofPiglet = no_ofPiglet;
  if (no_of_male) pigData.no_of_male = no_of_male;
  if (no_of_female) pigData.no_of_female = no_of_female;
  if (saw_id !== null) pigData.saw_id = saw_id;
  if (boar_id !== null) pigData.boar_id = boar_id;

  let pigExist;

  pigExist = await prisma.pig_details.findMany({
    where: {
      unique_id: pigData.unique_id,
    },
  });

  if (pigExist.length > 0)
    throw new AppError(409, "Data with this 'unique id' already exist");

  pigExist = await prisma.pig_details.findMany({
    where: {
      tag_no: pigData.tag_no,
    },
  });

  // TODO: if check for batch if exist, if don't exist thorw error

  if (pigExist.length > 0)
    throw new AppError(409, "Data with this 'tag no' already exist");

  // const batchIfExist = await batchExistDB(pigData.batch_no);

  // if (!batchIfExist) throw new AppError(400, "Provided batch no does not exist")
  console.log(pigData, "src/api/controllers/pigDetailsControllers 152");

  const pigDetails = await createPigDetails(pigData);

  return res.status(200).json({ status: "ok", data: pigDetails });
});
const pigUpdate = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const {
    id,
    breeding_details,
    // unique_id,
    // tag_no,
    age,
    weight,
    gender,
    fathers_tagNo,
    mothers_tagNo,
    predictive_pregnancy,
    sold,
    price,
    batch_no,
    grouping,
    is_ade3h_inj,
    expected_deworming_date,
    is_deworming,
    delivery_room_sentExpectedDate,
    is_deliveryRoomClean,
    expected_deliveryDate,
    expected_amoxcillin_powderDate,
    is_amoxicillin,
    expected_bitadinespray_date,
    is_bitadinespray,
    actual_deliverydate,
    no_ofPiglet,
    no_of_male,
    no_of_female,
    saw_id,
    boar_id,
    first_heatDate,
    second_heatDate,
    third_heatDate,
    first_crossingDate,
    is_rechockAfterFirstCrossingDate,
    second_crossingDate,
    expected_1stade3hInjDate,
    is_1stAde3h,
    expected_2ndade3hInjDate,
    date_of_lic_startedDate,
    is_2ndAde3h,
    whichPregnancy
  } = req.body;
  // res.send(req.query.breeding_details);

  requiredData(id, "id");
  requiredData(breeding_details, "breeding details");
  // requiredData(unique_id, "unique id");
  // requiredData(tag_no, "tag no");
  requiredData(age, "age");
  requiredData(weight, "weight");
  requiredData(gender, "gender");
  // requiredData(fathers_tagNo, "fathers tagNo");
  // requiredData(mothers_tagNo, "mothers tagNo");
  // requiredData(predictive_pregnancy, 'predictive pregnancy');
  requiredData(batch_no, "batch no");
  requiredData(grouping, "grouping");
  requiredData(expected_bitadinespray_date, "expected bitadinespray Date");
  requiredData(actual_deliverydate, "actual delivery Date");
  requiredData(first_crossingDate, "first crossing Date");

  const pigData: PigData = {
    id,
    breeding_details,
    // unique_id,
    // tag_no,
    age,
    weight,
    gender,
    fathers_tagNo,
    mothers_tagNo,
    whichPregnancy,
    predictive_pregnancy:
      predictive_pregnancy === true || predictive_pregnancy === "true"
        ? true
        : false,
    batch_no,
    grouping,
    is_ade3h_inj:
      is_ade3h_inj === true || is_ade3h_inj === "true" ? true : false,
    is_deworming:
      is_deworming === true || is_deworming === "true" ? true : false,
    is_deliveryRoomClean:
      is_deliveryRoomClean === true || is_deliveryRoomClean === "true"
        ? true
        : false,
    is_amoxicillin:
      is_amoxicillin === true || is_amoxicillin === "true" ? true : false,
    // expected_bitadinespray_date: new Date(expected_bitadinespray_date),
    // @ts-ignore
    expected_bitadinespray_date: convertToDateFormat(
      expected_bitadinespray_date,
      "expected bitadinespray date"
    ),
    is_bitadinespray:
      is_bitadinespray === true || is_bitadinespray === "true" ? true : false,
    // actual_deliverydate: new Date(actual_deliverydate),
    // @ts-ignore
    actual_deliverydate: convertToDateFormat(
      actual_deliverydate,
      "actual deliverydate"
    ),
    // first_crossingDate: new Date(first_crossingDate),
    // @ts-ignore
    first_crossingDate: convertToDateFormat(
      first_crossingDate,
      "first crossingDate"
    ),
    is_rechockAfterFirstCrossingDate:
      is_rechockAfterFirstCrossingDate === true ||
        is_rechockAfterFirstCrossingDate === "true"
        ? true
        : false,
    is_1stAde3h: is_1stAde3h === true || is_1stAde3h === "true" ? true : false,
    is_2ndAde3h: is_2ndAde3h === true || is_2ndAde3h === "true" ? true : false,
  };

  // let unique_idExist = [];

  // unique_idExist = await prisma.pig_details.findMany({
  //     where: {
  //         AND: [{
  //             unique_id: pigData.unique_id,
  //             NOT: { id: pigData.id }
  //         }]
  //     }
  // })
  // const unique_idExist = await prisma.pig_details.findUnique({
  //   where: { id: pigData.id },
  // });
  // console.log(id, unique_idExist, "unique_idExist");

  // if (
  //   unique_idExist &&
  //   Object.keys(unique_idExist).length > 0 &&
  //   unique_idExist.id !== id
  // ) {
  //   new AppError(400, "Given unique id is already exist");
  // }

  // if (unique_idExist) new AppError(400, "Given unique id is already exist")

  if (sold !== undefined)
    pigData.sold = sold === true || sold === "true" ? true : false;

  if (pigData.sold) {
    pigData.price = price ? price : 0
  }

  if (isDate(expected_deworming_date))
    pigData.expected_deworming_date = new Date(expected_deworming_date);
  if (isDate(delivery_room_sentExpectedDate))
    pigData.delivery_room_sentExpectedDate = new Date(
      delivery_room_sentExpectedDate
    );
  if (isDate(expected_deliveryDate))
    pigData.expected_deliveryDate = new Date(expected_deliveryDate);
  if (isDate(expected_amoxcillin_powderDate))
    pigData.expected_amoxcillin_powderDate = new Date(
      expected_amoxcillin_powderDate
    );
  if (isDate(first_heatDate)) pigData.first_heatDate = new Date(first_heatDate);
  if (isDate(second_heatDate))
    pigData.second_heatDate = new Date(second_heatDate);
  if (isDate(second_crossingDate))
    pigData.second_crossingDate = new Date(second_crossingDate);
  if (isDate(third_heatDate)) pigData.third_heatDate = new Date(third_heatDate);
  if (isDate(expected_1stade3hInjDate))
    pigData.expected_1stade3hInjDate = new Date(expected_1stade3hInjDate);
  if (isDate(expected_2ndade3hInjDate))
    pigData.expected_2ndade3hInjDate = new Date(expected_2ndade3hInjDate);
  if (isDate(date_of_lic_startedDate))
    pigData.date_of_lic_startedDate = new Date(date_of_lic_startedDate);

  if (no_ofPiglet) pigData.no_ofPiglet = no_ofPiglet;
  if (no_of_male) pigData.no_of_male = no_of_male;
  if (no_of_female) pigData.no_of_female = no_of_female;
  if (saw_id !== null) pigData.saw_id = saw_id;
  if (boar_id !== null) pigData.boar_id = boar_id;



  let data = null;
  try {
    // data = await addMedicineDataDB({ medicine_name, batch_no: batch, price, medicine_type, dose, date })
    data = await updatePigDetails(pigData);
    const ifExist = await getASoldPigsDB(data?.unique_id)
    if (ifExist) await deleteSoldPigsDB(data?.unique_id)
    if (pigData.sold) { await soldPigsDB(data?.unique_id, price ? +price : 0) }
    else { await deleteSoldPigsDB(data?.unique_id) }

  } catch (error) {
    errorHandlerDB(error);
  }

  if (data) {
    const ifExist = await getASoldPigsDB(data?.unique_id)
    if (ifExist) await deleteSoldPigsDB(data?.unique_id)
    if (pigData.sold) { await soldPigsDB(data?.unique_id, price ? +price : 0) }
    else { await deleteSoldPigsDB(data?.unique_id) }
  }

  return res.status(200).json({ status: "ok", data });
});

const pigDelete = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { uniqueId } = req.body;

  if (!uniqueId) throw new AppError(401, "UniqueId is not provided");
  const data = await deletePig(uniqueId);
  return res.status(200).json({ status: "ok", data });
});

const getPigs = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  console.log(req.query);
  const page: number = req.query.p ? +req.query.p : 0;
  const take: number = req.query.l ? +req.query.l : 100;
  const skip = page;

  const data = await getAllPigs(skip, take);

  const overAllPigs = await getAllPigsCount();

  return res
    .status(200)
    .json({ status: "ok", total: data.length, page, data, count: overAllPigs });
});

const addBatch = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { batch: btch } = req.body;

  const batch = btch ? btch.toLowerCase() : "";

  if (!batch) throw new AppError(400, "Please enter a valid batch number");

  // try {
  const ifBatchExist = await batchExistDB(batch);
  if (ifBatchExist && ifBatchExist.isActive === true)
    throw new AppError(401, "Batch number already exist");
  let data;
  if (ifBatchExist && ifBatchExist.isActive === false) {
    data = await turnBatchActiveDB(batch);
  } else {
    data = await addBatchDB(batch);
  }

  return res.status(200).json({ status: "ok", data });
});

const editBatch = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { id, batch: btch } = req.body;
  const batch = btch.toLowerCase();

  if (!id) throw new AppError(400, "Please provide a valid id");

  const ifBatchExistById = await batchExistByIdDB(id);
  if (!ifBatchExistById) throw new AppError(401, "Batch number does not exist");

  const ifBatchExist = await batchExistDB(batch);
  if (ifBatchExist && +ifBatchExist.id !== +id)
    throw new AppError(401, "Batch number already exist");

  const updatedBatch = await editBatchDB(id, batch);
  return res.status(200).json({ status: "ok", data: updatedBatch });
});

const deleteBatch = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { batch } = req.body;

  if (!batch) throw new AppError(400, "Please enter a valid batch number");
  const data = await deleteBatchDB(batch);

  return res.status(200).json({ status: "ok", data });
});

const allBatch = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  let data = [];
  const page: number = req.query.p ? +req.query.p : 0;
  const take: number = req.query.l ? +req.query.l : 100;
  const skip = page * take;
  try {
    data = await getAllBatchDB(skip, take);
  } catch (error: any) {
    // throw new AppError(502, error.message) //"Unable to get batch data"
    throw new AppError(502, "Unable to get batch data");
  }
  const total = data.length;

  const count = await getAllBatchCountDB();

  return res
    .status(200)
    .json({ status: "ok", total, page, data, count: count - 1 });
});

const pigsPerBatch = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { batch } = req.params;

  if (!batch)
    throw new AppError(401, "batch number should be given in the query url ");

  console.log(batch);

  //@ts-ignore
  const data = await pigsPerBatchDB(batch);
  const total = data.length;

  return res.status(200).json({ status: "ok", total, data });
});

const pigEdit = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { batch } = req.body;

  if (!batch)
    throw new AppError(401, "batch number should be given in the query url ");

  const batchExist = await getBatchDB(batch);
  if (!batchExist) throw new AppError(401, "batch number does not exist ");
  //@ts-ignore
  const data = await batchUpdateDB(batch);

  return res.status(200).json({ status: "ok", data });
});

const tags = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  let data;
  try {
    data = await getTagsDB();
  } catch (error) {
    errorHandlerDB(error);
  }
  return res.status(200).json({ status: "ok", data });
});

const feedingPlanAssign = catchAsync(async function (
  _req: AuthRequest,
  _res: Response,
  _next: NextFunction
) { });

const birthToFinishFeedingPlan = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { id } = req.query;

  // @ts-ignore
  const plan = await birthToFinishFeedingPlanDB(id);
  if (plan.length != 0) {
    return res.status(200).json({ status: "ok", plan });
  } else {
    return res
      .status(200)
      .json({ status: "forbidden", message: "pig not farrowing yet!" });
  }
});

const birthToFinishMedicinePlan = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { id } = req.query;

  // @ts-ignore
  const plan = await birthToFinishMedicinePlanDB(id);
  if (plan.length != 0) {
    return res.status(200).json({ status: "ok", plan });
  } else {
    return res
      .status(200)
      .json({ status: "forbidden", message: "no medicines for today!" });
  }
});

const breederAndLactationFeedingPlan = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const { id } = req.query;

  // @ts-ignore
  const plan = await breederAndLactationFeedingPlanDB(id);
  // @ts-ignore
  if (plan.length != 0) {
    return res.status(200).json({ status: "ok", plan });
  } else {
    return res
      .status(200)
      .json({ status: "forbidden", message: "no lactations for today!" });
  }
});

const fetchNotifications = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  const notifications = await fetchNotificationDB();
  return res.status(200).json({ status: "ok", notifications });
});

const sellPigs = catchAsync(async function (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const { pigId, price } = req.body;

    const pigsSold = await soldPigsDB(pigId, price);
    await updatePigDetailsByIdDB(pigId);
    return res.status(200).json({ status: "ok", data: pigsSold });
  } catch (error) {
    errorHandlerDB(error);
  }
});

const getSoldPigs = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const data = await getSoldPigsDB();
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    errorHandlerDB(error);
  }
});

const getPigsByGenderTag = catchAsync(async function (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
) {
  try {
    const data = await getPigByGenderDB();
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    errorHandlerDB(error);
    throw error;
  }
});

const pigDetailsController = {
  pigAdd,
  pigUpdate,
  pigDelete,
  getPigs,
  addBatch,
  editBatch,
  deleteBatch,
  allBatch,
  pigsPerBatch,
  pigEdit,
  tags,
  feedingPlanAssign,
  fetchNotifications,
  birthToFinishFeedingPlan,
  birthToFinishMedicinePlan,
  breederAndLactationFeedingPlan,
  sellPigs,
  getSoldPigs,
  getPigsByGenderTag,
};
export default pigDetailsController;

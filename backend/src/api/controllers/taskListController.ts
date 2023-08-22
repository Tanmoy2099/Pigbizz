import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
import { errorHandlerDB } from "../../utilServer/prismaCRUD/dbErrorHandler";
import {
  addTaskDB,
  deleteATaskDB,
  getATaskDB,
  getAssignedTaskListCount,
  getAssignedTaskListDB,
  getTaskListCount,
  getTaskListDB,
  getUserTaskListCount,
  getUserTaskListDB,
} from "../../utilServer/prismaCRUD/tasksListDB";
import { AppError } from "../../utilServer/catchError";
import { getUniqueUserDB } from "../../utilServer/prismaCRUD/userDB";
import { addNotificationDB } from "../../utilServer/prismaCRUD/notificationDB";


//TODO: Need to assign this to assignTask table also and show the data from this table only
export const getTaskList = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.query;

      const page: number = req.query.p ? +req.query.p : 0;
      const take: number = req.query.l ? +req.query.l : 100;
      const skip = page;

      // @ts-ignore
      const data = await getTaskListDB(userId, skip, take);
      const totalTasks = await getTaskListCount();

      return res
        .status(200)
        .json({ status: "ok", count: totalTasks, data: data });
    } catch (error) {
      errorHandlerDB(error);
    }
  }
);
export const deleteTask = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) next(new AppError(404, "task id not provided"));
    const idExist = await getATaskDB(+id)
    if (!idExist) next(new AppError(404, "task does not exist"));
    const idDelete = await deleteATaskDB(+id)
    if (!idDelete) next(new AppError(409, "Unable to delete the task"));

    return res
      .status(200)
      .json({ status: "ok", data: idDelete });
  });




export const postTask = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { assignee_id, assigned_id, task, remark } = req.body;

      if (!assignee_id) next(new AppError(404, "Assignee data is not provided"))
      if (!assigned_id) next(new AppError(404, "Assigned data is not provided"))
      if (!task) next(new AppError(404, "task is not provided"))

      //TODO: check assignee_id, assigned_id, exist and 1st one is admin, 2nd one is farm user
      const assigneeData = await getUniqueUserDB(assignee_id, true);

      if (!assigneeData) {
        next(new AppError(404, "Assignee data is not valid"));
      }
      const assignedData = await getUniqueUserDB(assigned_id);
      if (!assignedData) {
        next(new AppError(404, "Assigned user data is not valid"));
      }

      const dataToSend: any = { assignee_id, assigned_id, task, system: false }
      if (remark) dataToSend.remark = remark;

      const data = await addTaskDB(dataToSend);


      if (data) await addNotificationDB({ task_id: +data.id, user_id: +assigned_id, message: task })



      return res
        .status(200)
        .json({ status: "ok", data: data });
    } catch (error) {
      errorHandlerDB(error);
    }
  }
);

export const putTask = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id, assignee_id, assigned_id, task, remark } = req.body;

      if (!id) next(new AppError(404, "task id is not provided"))
      if (!assignee_id) next(new AppError(404, "Assignee data is not provided"))
      if (!assigned_id) next(new AppError(404, "Assigned data is not provided"))
      if (!task) next(new AppError(404, "task is not provided"))

      //TODO: check assignee_id, assigned_id, exist and 1st one is admin, 2nd one is farm user
      const assigneeData = await getUniqueUserDB(assignee_id, true);

      if (!assigneeData) {
        next(new AppError(404, "Assignee data is not valid"));
      }
      const assignedData = await getUniqueUserDB(assigned_id);
      if (!assignedData) {
        next(new AppError(404, "Assigned user data is not valid"));
      }

      const dataToSend: any = { assignee_id, assigned_id, task, system: false }
      if (remark) dataToSend.remark = remark;

      const data = await addTaskDB(dataToSend, +id);

      if (data) await addNotificationDB({ task_id: +data.id, user_id: +assigned_id, message: task })



      return res
        .status(200)
        .json({ status: "ok", data: data });
    } catch (error) {
      errorHandlerDB(error);
    }
  }
);

export const getAssignedTaskList = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

      const page: number = req.query.p ? +req.query.p : 0;
      const take: number = req.query.l ? +req.query.l : 100;
      const skip = page;

      const data = await getAssignedTaskListDB(skip, take);
      const totalTasks = await getAssignedTaskListCount();

      return res
        .status(200)
        .json({ status: "ok", count: data.length, total: totalTasks, data: data, page: page });
    } catch (error) {
      errorHandlerDB(error);
    }
    return
  }
);

export const getUserTaskList = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id: userId } = req.params;
  const page: number = req.query.p ? +req.query.p : 0;
  const take: number = req.query.l ? +req.query.l : 100;
  const skip = page;

  try {
    const data = await getUserTaskListDB(+userId, skip, take);
    const totalTasks = await getUserTaskListCount(+userId);

    return res
      .status(200)
      .json({ status: "ok", count: data.length, total: totalTasks, data: data, page: page });
  } catch (error) {
    errorHandlerDB(error);
  }
  return
});
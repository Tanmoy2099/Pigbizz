import { Router } from "express";
import { getTaskList, postTask, getAssignedTaskList, deleteTask, putTask, getUserTaskList } from "../controllers/taskListController";

const router = Router();

router.route("/get-tasks").get(getTaskList);

router.route("/assign-task")
    .get(getAssignedTaskList)
    .post(postTask)
    .put(putTask);

router.route("/assign-task/:id")
    .delete(deleteTask);

router.route("/user-task/:id").get(getUserTaskList);


export { router as taskListRoute };

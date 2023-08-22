import { Router } from "express";
// import { isAuth } from "../middleware/isAuth";
import expenseControllers from "../controllers/expenseControllers";

const router = Router();
// router.use(isAuth)


router
    .route("/")
    .post(expenseControllers.postExpense)
    .get(expenseControllers.getExpense)
    .put(expenseControllers.editExpense);

router
    .route("/:id")
    .delete(expenseControllers.deleteExpense);

router
    .route("/type")
    .get(expenseControllers.getTypes);

export { router as expenseRoute };
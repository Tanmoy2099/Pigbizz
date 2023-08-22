import { Router } from "express";
import authControllers from "../controllers/authControllers";
// import { body } from "express-validator";
// import { oneOf } from "express-validator/src/middlewares/one-of";

const router = Router();



router.post('/login', authControllers.signin);
router.post('/forgot-password', authControllers.forgotPassword);
router.post('/reset-password/:token', authControllers.resetPassword);

router.get('/farm', authControllers.getAllFarmUser);


export { router as authRoute }



    // , [

    //     // oneOf([
    //     body('email')
    //         .optional()
    //         .trim()
    //         .isEmail()
    //         .withMessage('Not a valid e-mail address'),
    //     body('phone')
    //         .optional()
    //         .trim()
    //         .isString()
    //         .isLength({ max: 10, min: 10 })
    //         .withMessage('Phone number should be 10 character long'),
    //     // ])
    //     // ,
    // ]

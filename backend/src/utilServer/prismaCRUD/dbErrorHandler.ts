import { AppError } from "../../utilServer/catchError";
// import dotenv from 'dotenv';
import 'dotenv/config';
// dotenv.config();


export function errorHandlerDB(err: any) {
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
        throw new AppError(500, "something went wrong!");
    } else {
        throw new AppError(400, err.message);
    }
}
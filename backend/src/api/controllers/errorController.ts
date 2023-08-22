
// import { NextFunction, Request } from "express";
// import { AppError } from "@/utilServer/catchError";

// class CustomError extends Error {
//     constructor(public errCode: number, public status: string) {
//         super();

//         // Set the prototype explicitly.
//         Object.setPrototypeOf(this, CustomError.prototype);
//     }

// }


const globalError = (err: any, req: any, res: any, next: any) => {
    err.errCode = err.errCode || 500
    err.status = err.status || "fail"

    // if (process.env.NODE_ENV === "development") {
    //     console.log({ name: err.name, message: err.message });
    //     errorForDev(res, err)
    // }
    if (process.env.NODE_ENV === "production") {
        errorForProd(res, err)
    } else {
        console.log({ name: err.name, message: err.message });
        errorForDev(res, err)
    }
    // next()
}


function errorForDev(res: any, err: any) {

    res.status(err.errCode).json({
        status: err.status,
        name: err.name ? err.name : "Unknown",
        message: err.message,
        error: err,
        stack: err.stack
    })
}

function errorForProd(res: any, err: any) {
    if (err.isOperational) {
        res.status(err.errCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        res.status(500).json({
            status: "fail",
            message: "something went wrong"
        })
    }
}

export default globalError;
// module.exports = globalError;
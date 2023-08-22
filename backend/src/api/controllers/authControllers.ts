import { catchAsync } from "../../utilServer/catchAsync";
import { NextFunction, Request, Response } from "express";

import { prisma } from "../../utilServer/connectDB";
import { AppError } from "../../utilServer/catchError";
// import { validationResult } from "express-validator/src/validation-result";
import type { sentUser } from "../../types/auth";
import { jwtToken } from "../../utilServer/helperFunctions";
import type { AuthRequest } from "../../types/authRequest";
import bcrypt from 'bcrypt';
import isEmail from "validator/lib/isEmail";
import { checkIfValidTokenDB, eraseToken, getUserData, resetToken, updatePassword } from "../../utilServer/prismaCRUD/authDB";
import { sendMail } from "../../utilServer/sendMail";
import { forgotPasswordtemplate } from "../../utilServer/mailTemplate/forgotPasswordTemplate";
import { encode, compare } from "../../utilServer/passwordEncode";
import { getUserDB } from "../../utilServer/prismaCRUD/userDB";


// import { User } from "@prisma/client";
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// const { catchAsync } = require("../../utilServer/catchAsync")
// const { NextFunction, Request, Response } = require("express")
// const { AppError } = require("../../utilServer/catchError")
// const { sentUser } = require("../../types/auth")
// const { jwtToken } = require("../../utilServer/helperFunctions")
// const { prisma } = require("../../utilServer/connectDB")
// const { AuthRequest } = require("../../types/authRequest")
// const { } = require()
// const { } = require()




const signin = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    // const errors = validationResult(req).array();

    // console.log("errors", errors);


    // if (errors.length > 0) throw new AppError(403, errors.join(', '));

    const { email, phone, password } = req.body;

    if (!email && !phone) throw new AppError(403, 'Please provide valid Email or Phone number ');


    const user = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { phone }]
        },
    });


    if (!user) throw new AppError(401, 'User does not exist');

    // password not salted
    if (user.passwordModified === false) {
        if (user.password !== password) throw new AppError(401, 'Incorrect password');
    } else {
        //TODO: password salted
        const result = compare(password, user.password);
        if (!result) throw new AppError(401, 'Incorrect password');

    }

    const sentUser: sentUser = { id: user.id, name: user.name, isAdmin: user.isAdmin };
    if (user.email) { sentUser.email = user.email; }
    if (user.phone) { sentUser.phone = user.phone; }
    // const sentUser = user

    // delete user.password
    const token = jwtToken(sentUser);

    // console.log('token', token);
    req.user = sentUser

    return res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV! === "production",
    }).status(200).json({ status: 'ok', token });
});


const forgotPassword = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { email, phone } = req.body;
    //TODO: implement phone when it is needed.
    let user;
    if (!phone && !email) return next(new AppError(404, 'Not a valid email address or phone number.'))
    if (email && !isEmail(email)) return next(new AppError(404, 'Not a valid email address.'))
    else if (phone && phone.length !== 10) return next(new AppError(404, 'Not a valid phone number.'))


    user = await getUserData(email, phone);
    if (!user) return next(new AppError(404, 'There is no user with this email address.'))

    const token = await resetToken(email, phone)
    try {

        const resetPassUrl = process.env?.FRONTEND_BASEURL! + '/forgot-password/' + token
        await sendMail(email.toLowerCase(), 'Click the Button to reset password', forgotPasswordtemplate('Click the Button to reset password', resetPassUrl, "reset Password"));

        return res.status(200).json({
            status: 'ok',
            data: 'Reset link is sent to your Email!'
        });

    } catch (error) {
        await eraseToken(email, phone)
        return next(
            new AppError(500, 'There was an error sending the email. Try again later!')
        );
    }

});
const resetPassword = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) return next(new AppError(500, 'Token is not valid'));

    const user = await checkIfValidTokenDB(token)
    if (Object.keys(user).length <= 0) return next(new AppError(500, 'Token is not valid'));

    //@ts-ignore
    if (new Date(user?.passwordResetExpires) < new Date()) return next(new AppError(500, 'Token has expired, please try again'));

    const pass = await encode(password);

    try {
        //@ts-ignore
        await updatePassword(pass, user?.email, user?.phone) //check
    } catch (error) {
        return next(
            new AppError(500, 'There is a problem reseting the password. Try again later!')
        );
    }

    return res.status(200).json({ status: 'ok', data: 'Password changed successfully!' })

});


const getAllFarmUser = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {
    const data = await getUserDB()
    return res.status(200).json({ status: 'ok', data });
})



const authControllers = { signin, forgotPassword, resetPassword, getAllFarmUser }
export default authControllers;
import type { AuthRequest } from "../../types/authRequest";
import { catchAsync } from "../../utilServer/catchAsync";
// import { Router } from "express";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../utilServer/connectDB";
import type { sentUser } from "../../types/auth";
import { JwtPayload } from "jwt-decode";
import { AppError } from "../../utilServer/catchError";


export const isAuth = catchAsync(async function (req: AuthRequest, res: Response, next: NextFunction) {

    let token = req.cookies['token'];

    const rawHeaders = req['rawHeaders']
    console.log(req, "req");
    //@ts-ignore
    console.log(req.tokenctx, "req.tokenctx");

    if (!token) {
        let tokenIndex = rawHeaders.findIndex(val => val === 'token');
        if (tokenIndex !== -1) {
            token = rawHeaders[tokenIndex + 1]
        }
        console.log(token, "token");
    }

    if (!token) {
        let tokenIndex = rawHeaders.findIndex(val => val === 'tokenctx');
        if (tokenIndex !== -1) {
            token = rawHeaders[tokenIndex + 1]
        }
        console.log(token, "token");

    }

    if (!token) {
        let tokenIndex = rawHeaders.findIndex(val => val === 'Cookie');
        if (tokenIndex !== -1) {
            token = rawHeaders[tokenIndex + 1]
        }
        console.log(token, "token");

    }

    if (!token) {
        return res.status(401).json({
            status: "fail",
            message: "User is not Authorized"
        });
    }

    const userdetails: string | JwtPayload | null = jwt.decode(token);

    // const user: any = {}
    // if (userdetails?.name) user.name = userdetails.name
    // // if (user?.iat) delete user.iat
    // // delete user.exp

    // for (let val in Object.keys(userdetails)) {
    //     console.log(val, typeof val);

    //     if (val !== 'iat' && val !== 'exp') {

    //         user[val] = userdetails[val]
    //     }
    // }


    const user = await prisma.user.findFirst({
        where: {

            // @ts-ignore
            OR: [{ email: userdetails.email }, { phone: userdetails.phone }]
        },
    });

    if (!user) throw new AppError(401, 'User does not exist');

    const sentUser: sentUser = { id: user.id, name: user.name, isAdmin: user.isAdmin };
    if (user.email) { sentUser.email = user.email; }
    if (user.phone) { sentUser.phone = user.phone; }

    req.user = sentUser


    return next()
})

// export { router as isAuthMiddleware };
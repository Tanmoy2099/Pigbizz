import jwt from "jsonwebtoken";
import { sentUser } from "../types/auth";

export function jwtToken(user: sentUser) {
    const token = jwt.sign(user, process.env.JWTTOKEN!, {
        expiresIn: '5d'
    });
    return token;
}
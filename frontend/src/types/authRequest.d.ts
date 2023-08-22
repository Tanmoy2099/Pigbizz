import { Request } from "express";
import { sentUser } from "./auth";

export interface AuthRequest extends Request {
    user?: sentUser
}
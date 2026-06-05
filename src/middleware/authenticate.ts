import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/lib/jwt";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    next(new AppError(401, "No token provided"));
    return;
  }
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    next(err);
  }
}

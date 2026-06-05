import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Prisma } from ".prisma/client";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: "error", message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      status: "error",
      message: "Validation failed",
      errors: err.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
    return;
  }

  if (err instanceof TokenExpiredError) {
    res.status(401).json({ status: "error", message: "Token expired" });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({ status: "error", message: "Invalid token" });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ status: "error", message: "Resource already exists" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ status: "error", message: "Resource not found" });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ status: "error", message: "Internal server error" });
}

import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { AppError } from "@/middleware/errorHandler";
import { AuthRequest } from "@/middleware/authenticate";
import { sendPasswordResetEmail } from "@/lib/mailer";

const select = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select,
    });
    res.status(201).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(401, "Invalid credentials");
    }
    const token = signToken({ userId: user.id });
    res.json({ status: "success", data: { token } });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select,
    });
    if (!user) throw new AppError(404, "User not found");
    res.json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond with success to prevent email enumeration
    if (!user) {
      res.json({
        status: "success",
        message: "If that email exists, a reset link has been sent",
      });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.APP_URL}/api/v1/auth/reset-password?token=${rawToken}`;

    if (process.env.NODE_ENV === "production") {
      await sendPasswordResetEmail(user.email, resetUrl);
      res.json({
        status: "success",
        message: "If that email exists, a reset link has been sent",
      });
    } else {
      // In dev return the token directly in the response
      res.json({ status: "success", data: { resetUrl, token: rawToken } });
    }
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new AppError(400, "Invalid or expired reset token");

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    });

    res.json({ status: "success", message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
}

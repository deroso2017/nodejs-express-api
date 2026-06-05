import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const select = { id: true, name: true, email: true, createdAt: true, updatedAt: true };

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({ select, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.user.count(),
    ]);

    res.json({
      status: "success",
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }, select });
    if (!user) throw new AppError(404, "User not found");
    res.json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed }, select });
    res.status(201).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      select,
    });
    res.json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

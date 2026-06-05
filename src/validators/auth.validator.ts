import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.email(),
    password: z.string().min(8).max(100),
    password_confirm: z.string().min(1),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

import { Router } from "express";
import {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
} from "@/controllers/auth.controller";
import { authenticate } from "@/middleware/authenticate";
import { validate } from "@/middleware/validate";
import { registerSchema, loginSchema } from "@/validators/auth.validator";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validators/password.validator";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;

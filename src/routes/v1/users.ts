import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/controllers/user.controller";
import { authenticate } from "@/middleware/authenticate";
import { validate } from "@/middleware/validate";
import {
  createUserSchema,
  updateUserSchema,
} from "@/validators/user.validator";

const router = Router();

router.use(authenticate);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;

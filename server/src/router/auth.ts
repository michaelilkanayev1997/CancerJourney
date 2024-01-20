import { Router } from "express";

import { create } from "#/controllers/auth";
import { validate } from "#/middleware/validator";
import { CreateUserSchema } from "#/utils/validationSchema";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

export default router;

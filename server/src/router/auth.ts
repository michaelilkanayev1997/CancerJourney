import { Router } from "express";

import {
  create,
  sendReVerificationToken,
  verifyEmail,
} from "#/controllers/auth";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  TokenAndIdValidation,
} from "#/utils/validationSchema";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);

export default router;

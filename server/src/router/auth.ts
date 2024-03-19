import { Router } from "express";

import {
  GoogleSignIn,
  create,
  generateForgetPasswordLink,
  grantValid,
  logOut,
  profileImageRemove,
  profileUpload,
  sendReVerificationToken,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "#/controllers/auth";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIdValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { profileImageUpload } from "#/middleware/fileUpload";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/google-sign-in", GoogleSignIn);
router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIdValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", mustAuth, (req, res) => {
  res.json({
    profile: req.user,
  });
});
router.post("/log-out", mustAuth, logOut);
router.post(
  "/profile-image-upload",
  mustAuth,
  profileImageUpload.single("avatar"),
  profileUpload
);
router.post("/profile-image-remove", mustAuth, profileImageRemove);
router.post("/update-profile", mustAuth, updateProfile);

export default router;

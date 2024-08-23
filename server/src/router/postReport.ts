import { Router } from "express";

import { addPostReport } from "../controllers/postReport";
import { mustAuth } from "../middleware/auth";
import { validate } from "../middleware/validator";
import { PostReportSchema } from "../utils/validationSchema";

const router = Router();

router.post(
  "/add-post-report",
  mustAuth,
  validate(PostReportSchema),
  addPostReport
);

export default router;

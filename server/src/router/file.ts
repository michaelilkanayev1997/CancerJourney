import { Router } from "express";

import { mustAuth } from "#/middleware/auth";
import { folderFileUpload } from "#/middleware/fileUpload";
import { fileUpload } from "#/controllers/file";

const router = Router();

router.post(
  "/file-upload",
  mustAuth,
  folderFileUpload.single("file"),
  fileUpload
);

export default router;

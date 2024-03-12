import { Router } from "express";

import { mustAuth } from "#/middleware/auth";
import { folderFileUpload } from "#/middleware/fileUpload";
import { fileRemove, fileUpload } from "#/controllers/file";

const router = Router();

router.post(
  "/file-upload",
  mustAuth,
  folderFileUpload.single("file"),
  fileUpload
);
router.delete("/file-delete", mustAuth, fileRemove);

export default router;

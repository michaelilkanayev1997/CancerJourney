import { Router } from "express";

import { mustAuth } from "#/middleware/auth";
import { folderFileUpload } from "#/middleware/fileUpload";
import { fileRemove, fileUpload, getFolderFiles } from "#/controllers/file";

const router = Router();

router.post(
  "/file-upload",
  mustAuth,
  folderFileUpload.single("file"),
  fileUpload
);
router.delete("/file-delete", mustAuth, fileRemove);
router.get("/:folder", mustAuth, getFolderFiles);

export default router;

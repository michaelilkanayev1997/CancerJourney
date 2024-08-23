import { Router } from "express";

import { mustAuth } from "../middleware/auth";
import { folderFileUpload } from "../middleware/fileUpload";
import {
  fileRemove,
  fileUpload,
  getFolderFiles,
  getFolderLength,
  updateFile,
} from "../controllers/file";
import { validate } from "../middleware/validator";
import { FileTitleAndDescSchema } from "../utils/validationSchema";

const router = Router();

router.post(
  "/file-upload",
  mustAuth,
  folderFileUpload.single("file"),
  validate(FileTitleAndDescSchema),
  fileUpload
);
router.delete("/file-delete", mustAuth, fileRemove);
router.get("/folders-length", mustAuth, getFolderLength);
router.get("/:foldername", mustAuth, getFolderFiles);
router.patch(
  "/file-update",
  mustAuth,
  validate(FileTitleAndDescSchema),
  updateFile
);

export default router;

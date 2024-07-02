import { Router } from "express";

import { addPost, getPosts } from "#/controllers/post";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { PostSchema } from "#/utils/validationSchema";
import { postImageUpload } from "#/middleware/fileUpload";

const router = Router();

router.get("/get-posts", mustAuth, getPosts);
router.post(
  "/add-post",
  mustAuth,
  postImageUpload.single("image"),
  validate(PostSchema),
  addPost
);

export default router;

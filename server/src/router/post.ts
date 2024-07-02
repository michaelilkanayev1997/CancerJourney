import { Router } from "express";

import { addPost, getPosts, updatePost } from "#/controllers/post";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { PostSchema } from "#/utils/validationSchema";
import { postImageUpload } from "#/middleware/fileUpload";
import { removePost } from "./../controllers/post";

const router = Router();

router.get("/get-posts", mustAuth, getPosts);
router.post(
  "/add-post",
  mustAuth,
  postImageUpload.single("image"),
  validate(PostSchema),
  addPost
);
router.delete("/post-delete", mustAuth, removePost);
router.patch(
  "/",
  mustAuth,
  postImageUpload.single("image"),
  validate(PostSchema),
  updatePost
);

export default router;

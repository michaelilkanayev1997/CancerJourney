import { Router } from "express";

import {
  addPost,
  addReply,
  getPosts,
  removeReply,
  togglePostFavorite,
  toggleReplyFavorite,
  updatePost,
} from "#/controllers/post";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { PostSchema, replyValidationSchema } from "#/utils/validationSchema";
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
router.post("/update-post-favorite", mustAuth, togglePostFavorite);
router.post("/add-reply", mustAuth, validate(replyValidationSchema), addReply);
router.delete("/reply-delete", mustAuth, removeReply);
router.post("/update-reply-favorite", mustAuth, toggleReplyFavorite);

export default router;

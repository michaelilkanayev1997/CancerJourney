import { Router } from "express";

import { getPosts } from "#/controllers/post";
import { mustAuth } from "#/middleware/auth";

const router = Router();

router.get("/get-posts", mustAuth, getPosts);

export default router;

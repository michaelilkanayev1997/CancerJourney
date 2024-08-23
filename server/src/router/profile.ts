import { Router } from "express";

import {
  getFollowers,
  getFollowings,
  updateFollower,
} from "../controllers/profile";
import { mustAuth } from "../middleware/auth";

const router = Router();

router.post("/update-follower/:profileId", mustAuth, updateFollower);
router.get("/get-followers/:profileId", mustAuth, getFollowers);
router.get("/get-followings/:profileId", mustAuth, getFollowings);

export default router;

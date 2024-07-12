import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

import User from "#/models/user";

export const updateFollower: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  let status: "added" | "removed";

  // Check if profileId is a valid object id OR profileId is now the authenticated user
  if (!isValidObjectId(profileId) || profileId === req.user.id.toString())
    return res.status(422).json({ error: "Invalid profile id!" });

  const profile = await User.findById(profileId);
  if (!profile) return res.status(404).json({ error: "Profile not found!" });

  const alreadyAFollower = await User.findOne({
    _id: profileId,
    followers: req.user.id,
  });

  if (alreadyAFollower) {
    // un follow
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $pull: { followers: req.user.id },
      }
    );

    status = "removed";
  } else {
    // follow the user
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $addToSet: { followers: req.user.id },
      }
    );

    status = "added";
  }

  if (status === "added") {
    // update the following list (add)
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { followings: profileId } }
    );
  }

  if (status === "removed") {
    // remove from the following list (remove)
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { followings: profileId } }
    );
  }

  res.json({ status });
};

export const getFollowers: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  // Check if profileId is a valid object id
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id!" });

  const profile = await User.findById(profileId).populate(
    "followers",
    "name avatar userType"
  );

  if (!profile) {
    return res.status(404).json({ error: "Profile not found!" });
  }

  res.json({ followers: profile.followers });
};

export const getFollowings: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  // Check if profileId is a valid object id
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id!" });

  const profile = await User.findById(profileId).populate(
    "followings",
    "name avatar.url userType"
  );

  if (!profile) {
    return res.status(404).json({ error: "Profile not found!" });
  }

  res.json({ followings: profile.followings });
};

import { RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";

import User from "../models/user";

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

  const profile = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(profileId) } },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "followers",
      },
    },
    { $unwind: "$followers" },
    {
      $project: {
        "followers._id": 1,
        "followers.name": 1,
        "followers.avatar": 1,
        "followers.userType": 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        followers: {
          $push: {
            _id: "$followers._id",
            userId: {
              _id: "$followers._id",
              name: "$followers.name",
              avatar: "$followers.avatar",
              userType: "$followers.userType",
            },
          },
        },
      },
    },
  ]);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found!" });
  }

  res.json({ followers: profile.length === 0 ? [] : profile[0].followers });
};

export const getFollowings: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  // Check if profileId is a valid object id
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id!" });

  const profile = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(profileId) } },
    {
      $lookup: {
        from: "users",
        localField: "followings",
        foreignField: "_id",
        as: "followings",
      },
    },
    { $unwind: "$followings" },
    {
      $project: {
        "followings._id": 1,
        "followings.name": 1,
        "followings.avatar": 1,
        "followings.userType": 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        followings: {
          $push: {
            _id: "$followings._id",
            userId: {
              _id: "$followings._id",
              name: "$followings.name",
              avatar: "$followings.avatar",
              userType: "$followings.userType",
            },
          },
        },
      },
    },
  ]);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found!" });
  }

  res.json({ followings: profile.length === 0 ? [] : profile[0].followings });
};

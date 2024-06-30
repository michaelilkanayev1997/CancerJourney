import { RequestHandler } from "express";

import { paginationQuery } from "#/@types/post";
import { Posts } from "#/models/post";

export const getPosts: RequestHandler = async (req, res) => {
  const { limit = "10", pageNo = "0" } = req.query as paginationQuery;

  try {
    const data = await Posts.find()
      .skip(parseInt(limit) * parseInt(pageNo))
      .limit(parseInt(limit))
      .sort({ createdAt: -1, _id: -1 }) // Sort by createdAt and _id in descending order
      .populate("owner", "name avatar userType") // Populate the owner field with name and profileImage
      .populate({
        path: "likes.userId",
        select: "name userType avatar",
      }) // Populate likes userId with name and profileImage
      .populate({
        path: "replies.owner",
        select: "name userType avatar",
      }) // Populate replies owner with name and profileImage
      .populate({
        path: "replies.likes.userId",
        select: "name userType avatar",
      }); // Populate replies likes userId with name and profileImage

    console.log("Fetched Posts:", data);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding the appointment",
    });
  }
};

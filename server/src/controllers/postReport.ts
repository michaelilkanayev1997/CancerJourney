import { RequestHandler } from "express";

import { PostReport } from "#/models/postReport";
import User from "#/models/user";

export const addPostReport: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Accessing the request body
    const { description, postId } = req.body;

    // Create a new Post document
    await PostReport.create({ description, postId, owner: user.id });

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding Post Report",
    });
  }
};

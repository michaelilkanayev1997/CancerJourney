import { RequestHandler } from "express";

import User from "#/models/user";
import { ReplyReport } from "#/models/replyReport";

export const addReplyReport: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Accessing the request body
    const { description, postId, replyId } = req.body;

    // Create a new Post document
    await ReplyReport.create({ description, postId, owner: user.id, replyId });

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding Reply Report",
    });
  }
};

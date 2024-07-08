import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

import { postPaginationQuery } from "#/@types/post";
import { Posts } from "#/models/post";
import User from "#/models/user";
import { deleteS3Object } from "#/middleware/fileUpload";

export const getPosts: RequestHandler = async (req, res) => {
  const {
    limit = "10",
    pageNo = "0",
    cancerType,
  } = req.query as postPaginationQuery;

  try {
    const query: any = {};
    if (cancerType) {
      query.forumType = cancerType;
    }

    const data = await Posts.find(query)
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

    res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding the appointment",
    });
  }
};

export const addPost: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Accessing the request body
    const { description, forumType } = req.body;

    const newPost: any = {
      owner: user.id,
      description,
      forumType,
      likes: [],
      replies: [],
    };

    // Check if image exists
    if (req.file) {
      // Set post image
      newPost.image = { url: req.file.location, public_id: req.file.key };
    }

    // Create a new Post document
    await Posts.create(newPost);

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding Post",
    });
  }
};

export const removePost: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { postId, ownerId } = req.query;

    if (!isValidObjectId(postId))
      return res.status(422).json({ error: "Invalid post id!" });

    if (!isValidObjectId(ownerId))
      return res.status(422).json({ error: "Invalid owner id!" });

    if (user.id !== ownerId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You are not the owner of this post!" });
    }

    // Remove entire post
    const post = await Posts.findOneAndDelete({
      _id: postId,
      owner: user.id,
    });

    if (!post) return res.status(404).json({ error: "Post not found!" });

    if (post.image && post.image.public_id) {
      // Delete the photo from AWS S3
      await deleteS3Object(post.image.public_id);
    }

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while deleting Post",
    });
  }
};

export const updatePost: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { postId, ownerId } = req.query;

    if (!isValidObjectId(postId))
      return res.status(422).json({ error: "Invalid post id!" });

    if (!isValidObjectId(ownerId))
      return res.status(422).json({ error: "Invalid owner id!" });

    if (user.id !== ownerId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You are not the owner of this post!" });
    }

    // Accessing the request body
    const { description, forumType } = req.body;

    let newPost = await Posts.findOneAndUpdate(
      { owner: user.id, _id: postId },
      { description, forumType },
      { new: true }
    );

    if (!newPost) return res.status(404).json({ error: "Post not found!" });

    // Check if image exists
    if (req.file) {
      if (newPost.image && newPost.image.public_id) {
        // Delete the image from AWS S3
        await deleteS3Object(newPost.image.public_id);
      }
      // Set post image
      newPost.image = { url: req.file.location, public_id: req.file.key };

      newPost = await newPost.save();
    }

    res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while updating Post",
    });
  }
};

export const togglePostFavorite: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { postId } = req.query;

    if (!isValidObjectId(postId))
      return res.status(422).json({ error: "Invalid post id!" });

    let status: "added" | "removed";

    const post = await Posts.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    const alreadyLiked = await Posts.findOne({
      _id: postId,
      likes: { $elemMatch: { userId: user.id } },
    });

    if (alreadyLiked) {
      // Remove the like
      await Posts.updateOne(
        {
          _id: postId,
        },
        {
          $pull: { likes: { userId: user.id } },
        }
      );

      status = "removed";
    } else {
      // add a Like
      await Posts.updateOne(
        {
          _id: postId,
        },
        {
          $addToSet: { likes: { userId: user.id, createdAt: new Date() } },
        }
      );

      status = "added";
    }

    res.json({ status });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while updating Favorite",
    });
  }
};

export const addReply: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { postId } = req.query;

    if (!isValidObjectId(postId))
      return res.status(422).json({ error: "Invalid post id!" });

    // Accessing the request body
    const { description } = req.body;

    const newReply: any = {
      owner: user.id,
      description,
      likes: [],
      createdAt: new Date(),
    };

    await Posts.updateOne({ _id: postId }, { $push: { replies: newReply } });

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding the reply",
    });
  }
};

export const removeReply: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { postId, replyId } = req.query;

    if (!isValidObjectId(postId))
      return res.status(422).json({ error: "Invalid post id!" });

    if (!isValidObjectId(replyId))
      return res.status(422).json({ error: "Invalid reply id!" });

    const post = await Posts.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    // Find the reply in the post's replies array
    const reply = post.replies.id(replyId) as any;
    if (!reply) return res.status(404).json({ error: "Reply not found!" });

    if (!reply.owner.equals(user.id)) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You are not the owner of this reply!" });
    }

    // Use $pull to remove the reply
    await Posts.updateOne(
      { _id: postId },
      { $pull: { replies: { _id: replyId } } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error occurred:", error); // Log the error for debugging
    return res.status(500).json({
      error: "An error occurred while deleting the reply",
    });
  }
};

export const toggleReplyFavorite: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { postId, replyId } = req.query;

    if (!isValidObjectId(postId))
      return res.status(422).json({ error: "Invalid post id!" });

    if (!isValidObjectId(replyId))
      return res.status(422).json({ error: "Invalid reply id!" });

    const post = await Posts.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    // Find the reply in the post's replies array
    const reply = post.replies.id(replyId);
    if (!reply) return res.status(404).json({ error: "Reply not found!" });

    let status: "added" | "removed";

    const alreadyLiked = await Posts.findOne({
      _id: postId,
      replies: {
        $elemMatch: {
          _id: replyId,
          "likes.userId": user.id,
        },
      },
    });
    console.log(alreadyLiked);
    if (alreadyLiked) {
      // Remove the like
      await Posts.updateOne(
        { _id: postId, "replies._id": replyId },
        { $pull: { "replies.$.likes": { userId: user.id } } }
      );

      status = "removed";
    } else {
      // Add the like
      await Posts.updateOne(
        { _id: postId, "replies._id": replyId },
        {
          $addToSet: {
            "replies.$.likes": { userId: user.id, createdAt: new Date() },
          },
        }
      );

      status = "added";
    }

    res.json({ status });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while updating Favorite",
    });
  }
};

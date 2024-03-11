import User from "#/models/user";
import { RequestHandler } from "express";

export const fileUpload: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Check if req.file exists
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded. Please upload a file.",
      });
    }
    console.log(req.file);

    // if (user.avatar?.publicId && user.avatar?.publicId !== "Google") {
    //   await deleteS3Object(`${user.avatar.publicId}`);
    // }

    // user.avatar = { url: req.file.location, publicId: req.file.key };
    // console.log(user.avatar);
    // await user.save();

    res.json({ success: true, fileUrl: req.file });
  } catch (error) {
    // 'error' as an instance of 'Error'
    const errorMessage = (error as Error).message;
    return res.status(500).json({
      error: "An error occurred while uploading the file: " + errorMessage,
    });
  }
};

import { Files } from "#/models/Files";
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

    // Accessing title and description from the request body
    const { title, description } = req.body;

    if (title === "") throw new Error("title is a required field !");

    const newFile = {
      title,
      description,
      key: req.file.key,
      type: req.file.mimetype.includes("pdf") ? "pdf" : "image",
    };

    const name = req.file.originalname.toLowerCase().replace(/\s+/g, ""); // Remove space & LowerCase

    // Update or insert UserFiles document
    await Files.updateOne(
      { owner: user.id },
      {
        $push: { [name]: newFile },
      },
      { upsert: true } // create a new document if one doesn't exist
    );

    res.json({ success: true, file: req.file });
  } catch (error) {
    // 'error' as an instance of 'Error'
    const errorMessage = (error as Error).message;
    return res.status(500).json({
      error: "An error occurred while uploading the file: " + errorMessage,
    });
  }
};

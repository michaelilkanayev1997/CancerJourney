import { UploadFileRequest } from "#/@types/files";
import { deleteS3Object } from "#/middleware/fileUpload";
import { Files } from "#/models/files";
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

export const fileRemove: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { fileId, folderName } = req.query;

    // Type checking and conversion if necessary
    if (typeof folderName !== "string" || typeof fileId !== "string") {
      return res.status(400).json({ error: "Invalid query parameters." });
    }

    // Retrieve the file document from MongoDB
    const fileDocument = await Files.findOne(
      { [`${folderName}._id`]: fileId },
      { [`${folderName}.$`]: 1 }
    );

    // Use bracket notation to dynamically access the folder

    if (!fileDocument) {
      // Handle the case where no document is found
      console.log("File not found.");
      return;
    }

    // Dolder is an array and we want the first item
    const fileToRemove = fileDocument[folderName][0];
    console.log(fileToRemove);

    const dbRemove = await Files.updateOne(
      { _id: fileDocument._id }, // Use the parent document's _id to identify it
      { $pull: { [folderName]: { _id: fileToRemove._id } } } // Pull operation to remove the specific file
    );

    if (dbRemove.acknowledged) {
      // Delete the file from AWS S3
      await deleteS3Object(fileToRemove.key);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete file", error);
    return res.status(500).json({
      error: "An error occurred while removing the file",
    });
  }
};

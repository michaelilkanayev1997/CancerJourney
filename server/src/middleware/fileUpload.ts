const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

import {
  S3_ACCESS_KEY,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_SECRET_KEY,
} from "#/utils/variables";

const s3 = new S3Client({
  credentials: {
    secretAccessKey: S3_SECRET_KEY,
    accessKeyId: S3_ACCESS_KEY,
  },
  region: S3_REGION,
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, and WEBP files are allowed."
      ),
      false
    );
  }
};

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      // Include user's _id as part of the file's metadata
      console.log(file);
      cb(null, {
        uploadedBy: String(req.user.id),
      });
    },
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, `${req.user.id}/profile${extension}`);
    },
  }),
  fileFilter: fileFilter,
});

// Function to delete an object from S3
export const deleteS3Object = async (objectKey: string) => {
  try {
    const deleteParams = {
      Bucket: S3_BUCKET_NAME,
      Key: objectKey,
    };

    // Create a command to delete the object
    const command = new DeleteObjectCommand(deleteParams);

    // Send the command to S3
    const response = await s3.send(command);

    console.log("Successfully deleted object from S3:", response);
    return response; // The response doesn't include any useful information for a successful delete
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    throw error;
  }
};

// deleteS3Object("65d9202c7aa232603a4c8a5c/profile.png")
//   .then(() => console.log("File deleted successfully"))
//   .catch((error) => console.error("Failed to delete file", error));

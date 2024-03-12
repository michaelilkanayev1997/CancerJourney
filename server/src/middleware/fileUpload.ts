const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
import { FileFilterCallback } from "multer";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

import {
  S3_ACCESS_KEY,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_SECRET_KEY,
} from "#/utils/variables";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  credentials: {
    secretAccessKey: S3_SECRET_KEY,
    accessKeyId: S3_ACCESS_KEY,
  },
  region: S3_REGION,
});

const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, and WEBP files are allowed."
      ) as any,
      false
    );
  }
};

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file with a custom error message
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, WEBP images and PDF files are allowed."
      ) as any,
      false
    );
  }
};

export const profileImageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req: any, file: any, cb: any) => {
      cb(null, {
        uploadedBy: String(req.user.id),
      });
    },
    key: (req: any, file: any, cb: any) => {
      cb(null, `${req.user.id}/profile-${Date.now()}`);
    },
  }),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

export const folderFileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req: any, file: any, cb: any) => {
      cb(null, {
        uploadedBy: String(req.user.id),
      });
    },
    key: (req: any, file: any, cb: any) => {
      // Generate a 16-byte random hex string
      const randomBytes = crypto.randomBytes(16).toString("hex");

      // Remove space & LowerCase
      const folderName = file.originalname.toLowerCase().replace(/\s+/g, "");

      // Construct the S3 object key with the user ID, processed file name, random bytes, and timestamp
      cb(null, `${req.user.id}/${folderName}/${randomBytes}-${Date.now()}`);
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
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

    return response; // The response doesn't include any useful information for a successful delete
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    throw error;
  }
};

export async function generateSignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });

  // URL expires in 3600 seconds (1 hour)
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return signedUrl;
}

const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

import {
  S3_ACCESS_KEY,
  S3_BUCKET_NAME,
  S3_SECRET_KEY,
} from "#/utils/variables";

const s3 = new S3Client({
  credentials: {
    secretAccessKey: S3_SECRET_KEY,
    accessKeyId: S3_ACCESS_KEY,
  },
  region: "eu-central-1",
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
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, `${Date.now().toString()}${extension}`); // Adds file extension to key
    },
  }),
  fileFilter: fileFilter,
});

import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface IFile {
  name: string;
  description?: string;
  uploadTime: Date;
  key: string;
  type: "image" | "pdf";
}

interface IUserFiles extends Document {
  owner: ObjectId;
  bloodtests: IFile[];
  treatments: IFile[];
  medications: IFile[];
  reports: IFile[];
  scans: IFile[];
  appointments: IFile[];
  other: IFile[];
}

const FileSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: String,
  uploadTime: { type: Date, default: Date.now },
  key: { type: String, required: true },
  type: { type: String, enum: ["image", "pdf"], required: true },
});

const UserFilesSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bloodtests: [FileSchema],
  treatments: [FileSchema],
  medications: [FileSchema],
  reports: [FileSchema],
  scans: [FileSchema],
  appointments: [FileSchema],
  other: [FileSchema],
});

export const UserFiles = mongoose.model<IUserFiles>(
  "UserFiles",
  UserFilesSchema
);

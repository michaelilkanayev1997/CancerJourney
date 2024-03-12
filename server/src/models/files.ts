import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface IFile {
  _id: ObjectId;
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
  [key: string]: any; // index signature
}

const FileSchema: Schema = new Schema({
  title: { type: String, required: true },
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

export const Files = mongoose.model<IUserFiles>("Files", UserFilesSchema);

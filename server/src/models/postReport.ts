import mongoose, { Schema } from "mongoose";

interface IPostReport extends Document {
  owner: mongoose.Types.ObjectId;
  description: string;
  postId: mongoose.Types.ObjectId;
}

const postReportSchema = new Schema<IPostReport>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: {
      type: String,
      required: true,
    },
    postId: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
  },
  { timestamps: true }
);

export const PostReport = mongoose.model<IPostReport>(
  "PostReport",
  postReportSchema
);

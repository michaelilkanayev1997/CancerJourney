import mongoose, { Schema } from "mongoose";

interface IReplyReport extends Document {
  owner: mongoose.Types.ObjectId;
  description: string;
  postId: mongoose.Types.ObjectId;
  replyId: mongoose.Types.ObjectId;
}

const replyReportSchema = new Schema<IReplyReport>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: {
      type: String,
      required: true,
    },
    postId: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
    replyId: {
      type: Schema.Types.ObjectId,
      ref: "Posts.replies",
      required: true,
    },
  },
  { timestamps: true }
);

export const ReplyReport = mongoose.model<IReplyReport>(
  "ReplyReport",
  replyReportSchema
);

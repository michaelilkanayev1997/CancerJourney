import mongoose, { Schema } from "mongoose";

import { cancerTypes } from "#/utils/enums";

interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

interface IReply extends Document {
  owner: mongoose.Types.ObjectId;
  description: string;
  likes: ILike[];
  createdAt: Date;
}

interface IPost extends Document {
  description: string;
  image: { public_id: string; url: string } | null;
  owner: mongoose.Types.ObjectId;
  likes: ILike[];
  replies: mongoose.Types.DocumentArray<IReply>;
  createdAt: Date;
  forumType: string;
}

const likeSchema = new Schema<ILike>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const replySchema = new Schema<IReply>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: {
    type: String,
    required: true,
  },
  likes: [likeSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new Schema<IPost>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: {
      type: String,
      required: true,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    likes: [likeSchema],
    replies: [replySchema],
    forumType: {
      type: String,
      required: true,
      enum: cancerTypes,
    },
  },
  { timestamps: true }
);

export const Posts = mongoose.model<IPost>("Posts", postSchema);

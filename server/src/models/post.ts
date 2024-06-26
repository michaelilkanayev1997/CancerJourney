import mongoose, { Schema } from "mongoose";

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
  image: {
    public_id: string;
    url: string;
  };
  owner: mongoose.Types.ObjectId;
  likes: ILike[];
  replies: IReply[];
  createdAt: Date;
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
  },
  { timestamps: true }
);

export const Posts = mongoose.model<IPost>("Posts", postSchema);

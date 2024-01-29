import { Model, model, ObjectId, Schema } from "mongoose";
import { hash, compare } from "bcrypt";

// interface (typescript)
interface PasswordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const passwordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Methods
>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, // expire the token after 1 hr (60 min * 60 sec = 3600s)
    default: Date.now(),
  },
});

passwordResetTokenSchema.pre("save", async function (next) {
  // hash the token
  if (this.isModified("token")) {
    //Enter only if this token is changed
    this.token = await hash(this.token, 10);
  }
  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

export default model("PasswordResetToken", passwordResetTokenSchema) as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;

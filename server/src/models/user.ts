import { compare, hash } from "bcrypt";
import { Model, ObjectId, Schema, model } from "mongoose";

// interface (typescript)
export interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar: { url: string; publicId: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  // NewProfile properties
  gender: string;
  userType: string;
  cancerType: string;
  birthDate: Date | string;
  diagnosisDate?: Date;
  subtype?: string;
  stage?: string;
  country?: { cca2: string; name: string };

  expoPushToken: string;
}

//Methods interface is used to define schema methods
interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

// In Mongoose, second generic type argument in Schema is used to define any nested schemas or additional options for the schema.
// The empty object {} signifies that there are no additional schema options or nested schemas to include in this instance.
const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      default: "Google",
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [String],

    // NewProfile properties
    userType: { type: String, default: "" },
    cancerType: { type: String, default: "" },
    gender: { type: String, default: "" },
    birthDate: { type: Date, default: null },
    diagnosisDate: { type: Date },
    stage: { type: String },
    country: {
      type: Object,
      cca2: String,
      name: String,
      flag: String,
    },

    expoPushToken: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // hash the password
  if (this.isModified("password")) {
    //Enter only if this password is changed
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};

export default model("User", userSchema) as Model<UserDocument, {}, Methods>;

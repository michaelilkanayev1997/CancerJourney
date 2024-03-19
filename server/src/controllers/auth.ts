import { RequestHandler } from "express";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";

import {
  CreateUser,
  UpdatePasswordRequest,
  UserIdRequest,
  VerifyEmailRequest,
} from "#/@types/user";
import User from "#/models/user";
import { generateToken, verifyGoogleToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import { deleteS3Object } from "#/middleware/fileUpload";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser)
    return res.status(403).json({ error: "Email is already in use!" });

  const user = await User.create({ email, password, name });

  // Generate Token
  const token = generateToken(4);
  // Send Verification Email
  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  console.log(verificationToken);

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken.compareToken(token);

  console.log(matched);

  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified!" });
};

export const sendReVerificationToken: RequestHandler = async (
  req: UserIdRequest,
  res
) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid Request !" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid Request !" });

  if (user.verified)
    return res.status(422).json({ error: "Your account is verified already!" });

  await EmailVerificationToken.findOneAndDelete({ owner: userId });

  const token = generateToken(4);

  await EmailVerificationToken.create({ owner: userId, token });

  // Send Verification Email
  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  });

  res.json({ messgae: "please check your email." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found!" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  // generate the link
  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email, link: resetLink });

  res.json({ message: "Check your registered mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
  return res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (
  req: UpdatePasswordRequest,
  res
) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(403)
      .json({ eror: "The new password must be different!" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });
  //send the seccess email
  sendPassResetSuccessEmail(user.name, user.email);
  res.json({ message: "Password resets seccessfully!" });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user)
    return res.status(403).json({ error: "Email/Password not found!" });

  // Compare the password
  const matched = await user.comparePassword(password);
  if (!matched)
    return res.status(403).json({ error: "Email/Password not found!" });

  // Generate the token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  user.tokens.push(token);

  await user.save();

  return res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const GoogleSignIn: RequestHandler = async (req, res) => {
  const { googleToken } = req.body;

  try {
    const googleUser = await verifyGoogleToken(googleToken);
    const oldUser = await User.findOne({ email: googleUser.email });

    if (oldUser) {
      if (oldUser.password !== "Google") {
        return res
          .status(403)
          .json({ error: "Email is already in use with regular sign-in!" });
      }
      // Generate the token
      const token = jwt.sign({ userId: oldUser._id }, JWT_SECRET);

      oldUser.tokens.push(token);

      await oldUser.save();

      return res.json({
        profile: {
          id: oldUser._id,
          name: oldUser.name,
          email: oldUser.email,
          verified: oldUser.verified,
          avatar: oldUser.avatar?.url,
          followers: oldUser.followers.length,
          followings: oldUser.followings.length,
        },
        token: token,
      });
    }

    if (googleUser) {
      const createdUser = await User.create({
        email: googleUser.email,
        name: googleUser.name,
        avatar: { url: googleUser.picture, publicId: "Google" },
        verified: googleUser.verified_email,
      });

      if (!createdUser) {
        return res
          .status(500)
          .json({ error: "Failed to create user. Please try again later." });
      }

      // Generate the token
      const token = jwt.sign({ userId: createdUser._id }, JWT_SECRET);

      createdUser.tokens.push(token);

      await createdUser.save();

      return res.json({
        profile: {
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          verified: createdUser.verified,
          avatar: createdUser.avatar?.url,
          followers: createdUser.followers.length,
          followings: createdUser.followings.length,
        },
        token,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went wrong, user not found!");

  // logout from all
  if (fromAll === "yes") user.tokens = [];
  // logout
  else user.tokens = user.tokens.filter((t) => t !== token);

  await user.save();
  res.json({ success: true });
};

export const profileUpload: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Check if req.file exists
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded. Please upload a file.",
      });
    }

    // If avatar exists and it's not a Google avatar then Delete it from aws
    if (user.avatar?.publicId && user.avatar?.publicId !== "Google") {
      await deleteS3Object(`${user.avatar.publicId}`);
    }

    // Set user new avatar
    user.avatar = { url: req.file.location, publicId: req.file.key };

    await user.save();

    res.json({ success: true, fileUrl: req.file });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while uploading the profile image",
    });
  }
};

export const profileImageRemove: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    if (!user.avatar) throw new Error("There is no a profile image");

    if (user.avatar.publicId !== "Google") {
      const res = await deleteS3Object(`${user.avatar.publicId}`);
      console.log(res);
    }

    user.avatar = { url: "", publicId: "" };

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete file", error);
    return res.status(500).json({
      error: "An error occurred while removing the file",
    });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body; // The new profile data from the request body
    console.log(profileData);
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (profileData.name) {
      user.name = profileData.name; // Optional, so it might not be provided
    }

    // Update or set the profile information
    user.userType = profileData.userType;
    user.diagnosisDate = profileData.diagnosisDate;
    user.cancerType = profileData.cancerType;
    user.subtype = profileData.subtype;
    user.stage = profileData.stage;
    user.gender = profileData.gender;
    user.birthDate = profileData.birthDate;
    user.country = profileData.country;

    // Save the updated user document
    await user.save();

    // Respond with the updated user profile
    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};

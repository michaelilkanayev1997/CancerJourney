import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import PasswordResetToken from "#/models/passwordResetToken";
import { JWT_SECRET } from "#/utils/variables";
import User from "#/models/user";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthorized access, Invalid Request !" });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ error: "Unauthorized access, Invalid Request !" });

  next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token) return res.status(403).json({ error: "Unauthorized request" });

  const payload = verify(token, JWT_SECRET) as JwtPayload;
  const id = payload.userId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) return res.status(403).json({ error: "Unauthorized request" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers,
    followings: user.followings,
    createdAt: user.createdAt,

    gender: user.gender,
    birthDate: user.birthDate,
    userType: user.userType,
    cancerType: user.cancerType,
    diagnosisDate: user.diagnosisDate,
    stage: user.stage,
    country: user.country,

    expoPushToken: user.expoPushToken,
  };

  req.token = token;

  next();
};

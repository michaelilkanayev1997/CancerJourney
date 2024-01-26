import { RequestHandler } from "express";

import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ email, password, name });

  // Generate Token
  const token = generateToken(6);
  // Send Verification Email
  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

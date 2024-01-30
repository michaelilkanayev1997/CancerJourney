import { Request } from "express";

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface VerifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}

export interface UpdatePasswordRequest extends Request {
  body: {
    userId: string;
    password: string;
  };
}

export interface UserIdRequest extends Request {
  body: {
    userId: string;
  };
}

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: any;
        name: string;
        email: string;
        verified: boolean;
        avatar?: string;
        followers: number;
        followings: number;
      };
      token: string;
    }
  }
}

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

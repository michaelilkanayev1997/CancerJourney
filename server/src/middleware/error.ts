import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return res.status(409).json({ error: message }); // 409 Conflict
  }

  // Generic error handler as a catch-all
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use 500 if statusCode not set
  res.status(statusCode).json({ error: err.message });
};

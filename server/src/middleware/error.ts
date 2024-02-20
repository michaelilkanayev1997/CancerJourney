import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Generic error handler as a catch-all
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use 500 if statusCode not set
  res.status(statusCode).json({ error: err.message });
};

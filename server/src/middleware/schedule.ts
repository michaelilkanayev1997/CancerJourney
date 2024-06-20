import { RequestHandler } from "express";

export const parseSpecificDaysAndDate: RequestHandler = (req, res, next) => {
  if (req.body.specificDays) {
    try {
      req.body.specificDays = JSON.parse(req.body.specificDays);
      req.body.date = new Date(req.body.date);
    } catch (error) {
      return res.status(400).json({ message: "Invalid specificDays format" });
    }
  }
  next();
};

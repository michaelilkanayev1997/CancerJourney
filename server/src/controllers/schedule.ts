import { RequestHandler } from "express";

import User from "#/models/user";
import { Schedule } from "#/models/Schedule";

export const addAppointment: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Accessing title and description from the request body
    const { location, time, type, notes } = req.body;

    const newAppointment = {
      location,
      time,
      type,
      notes,
    };

    // Update or insert document with the new appointment
    await Schedule.updateOne(
      { owner: user.id },
      {
        $push: { appointments: newAppointment },
      },
      { upsert: true } // create a new document if one doesn't exist
    );

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding the appointment",
    });
  }
};

import { RequestHandler } from "express";

import User from "#/models/user";
import { Schedule } from "#/models/Schedule";

export const addAppointment: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Accessing title and description from the request body
    const { title, location, date, reminder, notes } = req.body;

    const newAppointment = {
      title,
      location,
      date,
      reminder,
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

export const addMedication: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Check if req.file exists
    if (req.file) {
      key = req.file.key;
      type = "image";
      console.log(req.file);
    }
    console.log(req.file);
    // Accessing title and description from the request body
    const { name, frequency, timesPerDay, specificDays, prescriber, notes } =
      req.body;

    const newMedication = {
      name,
      frequency,
      timesPerDay,
      specificDays,
      prescriber,
      notes,
    };

    // Update or insert UserFiles document
    await Schedule.updateOne(
      { owner: user.id },
      {
        $push: { medications: newMedication },
      },
      { upsert: true } // create a new document if one doesn't exist
    );

    res.json({ success: true, file: req.file });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while uploading the file",
    });
  }
};

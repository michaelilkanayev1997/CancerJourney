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
    const {
      name,
      frequency,
      timesPerDay,
      specificDays,
      prescriber,
      notes,
      date,
    } = req.body;

    const newMedication = {
      name,
      frequency,
      timesPerDay,
      specificDays,
      prescriber,
      notes,
      date,
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

export const getSchedule: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { schedulename } = req.params; // Get the schedule name from the URL

    // Validate if the schedule name is one of the allowed
    const allowedSchedules = ["appointments", "medications"];

    if (!allowedSchedules.includes(schedulename)) {
      return res.status(400).send({ error: "Invalid schedule name" });
    }

    const sortedFolderFiles = await Schedule.aggregate([
      { $match: { owner: req.user.id } }, // Match the document by owner
      { $unwind: `$${schedulename}` }, // Deconstruct the array in the document
      { $replaceRoot: { newRoot: `$${schedulename}` } }, // Promote nested objects to top level
      { $sort: { date: -1 } }, // Sort the documents by date in descending order
    ]);

    if (!sortedFolderFiles) {
      return res.status(404).send({ error: "Schedule not found" });
    }

    // Send the Schedules
    res.status(200).send(sortedFolderFiles);
  } catch (error) {
    console.error("Failed to get Schedules", error);
    return res.status(500).json({
      error: "An error occurred while getting the Schedules",
    });
  }
};

export const scheduleRemove: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    const { scheduleId, scheduleName } = req.query;

    // Type checking
    if (typeof scheduleName !== "string" || typeof scheduleId !== "string") {
      return res.status(400).json({ error: "Invalid query parameters." });
    }

    // Retrieve the file document from MongoDB
    const scheduleDocument = await Schedule.findOne(
      { [`${scheduleName}._id`]: scheduleId },
      { [`${scheduleName}.$`]: 1 }
    );

    // Handle the case where no document is found
    if (!scheduleDocument) {
      res.status(400).json({ error: "File not found" });
      return;
    }

    // schedule is an array and we want the first item
    const scheduleToRemove = scheduleDocument[scheduleName][0];
    const dbRemove = await Schedule.updateOne(
      { _id: scheduleDocument._id }, // Use the parent document's _id to identify it
      { $pull: { [scheduleName]: { _id: scheduleToRemove._id } } } // Pull operation to remove the specific file
    );

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while removing the schedule",
    });
  }
};

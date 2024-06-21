import { RequestHandler } from "express";

import User from "#/models/user";
import { Schedule } from "#/models/Schedule";
import { MedicationInput } from "#/@types/schedule";
import { deleteS3Object } from "#/middleware/fileUpload";

export const addAppointment: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("Something went wrong, user not found!");

    // Accessing the request body
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

    // Accessing the request body
    const {
      name,
      frequency,
      timesPerDay,
      specificDays,
      prescriber,
      notes,
      date,
    } = req.body;

    if (
      (frequency === "Every day" || frequency === "Specific days") &&
      timesPerDay === undefined
    ) {
      return res.status(400).send({
        error:
          "Times per day is required when frequency is 'Every day' or 'Specific days'",
      });
    } else if (frequency === "Specific days" && specificDays.length === 0) {
      return res.status(400).send({
        error: "Specific days are required when frequency is 'Specific days'",
      });
    }

    const newMedication: MedicationInput = {
      name,
      frequency,
      timesPerDay,
      specificDays,
      prescriber,
      notes,
      date,
    };

    // Check if photo exists
    if (req.file) {
      // Set medication photo
      newMedication.photo = { url: req.file.location, publicId: req.file.key };
    }

    // Update or insert Medication Schedule document
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
      error: "An error occurred while adding Medication",
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
      res.status(400).json({ error: "schedule not found" });
      return;
    }

    // schedule is an array and we want the first item
    const scheduleToRemove = scheduleDocument[scheduleName][0];

    const dbRemove = await Schedule.updateOne(
      { _id: scheduleDocument._id }, // Use the parent document's _id to identify it
      { $pull: { [scheduleName]: { _id: scheduleToRemove._id } } } // Pull operation to remove the specific file
    );

    if (
      dbRemove.acknowledged &&
      scheduleName === "medications" &&
      scheduleToRemove.photo
    ) {
      // Delete the photo from AWS S3
      await deleteS3Object(scheduleToRemove.photo.publicId);
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occurred while removing the schedule",
    });
  }
};

export const updateSchedule: RequestHandler = async (req, res) => {
  const { scheduleId, scheduleName } = req.query;
  const ownerId = req.user.id;

  // Type checking
  if (typeof scheduleName !== "string" || typeof scheduleId !== "string") {
    return res.status(400).json({ error: "Invalid query parameters." });
  }

  let updateResult;
  if (scheduleName === "appointments") {
    // Accessing the request body of appointment
    const { title, location, date, reminder, notes } = req.body;

    updateResult = await Schedule.findOneAndUpdate(
      {
        owner: ownerId, // Match the owner of the document
        [`${scheduleName}._id`]: scheduleId, // Match the file by _id within the specified folder array
      },
      {
        $set: {
          // Use the positional $ operator to update values of the matched schedule
          [`${scheduleName}.$.title`]: title,
          [`${scheduleName}.$.location`]: location,
          [`${scheduleName}.$.date`]: date,
          [`${scheduleName}.$.reminder`]: reminder,
          [`${scheduleName}.$.notes`]: notes,
        },
      },
      {
        new: true, // Returns the updated document
        projection: { [scheduleName]: { $elemMatch: { _id: scheduleId } } }, // Project only the matching subdocument
      }
    );
  } else if (scheduleName === "medications") {
    // Accessing the request body of medication
    const { name, frequency, timesPerDay, specificDays, prescriber, notes } =
      req.body;

    updateResult = await Schedule.findOneAndUpdate(
      {
        owner: ownerId, // Match the owner of the document
        [`${scheduleName}._id`]: scheduleId, // Match the file by _id within the specified folder array
      },
      {
        $set: {
          // Use the positional $ operator to update values of the matched schedule
          [`${scheduleName}.$.name`]: name,
          [`${scheduleName}.$.frequency`]: frequency,
          [`${scheduleName}.$.timesPerDay`]: timesPerDay,
          [`${scheduleName}.$.specificDays`]: specificDays,
          [`${scheduleName}.$.prescriber`]: prescriber,
          [`${scheduleName}.$.notes`]: notes,
        },
      },
      {
        new: true, // Returns the updated document
        projection: { [scheduleName]: { $elemMatch: { _id: scheduleId } } }, // Project only the matching subdocument
      }
    );
  }

  if (!updateResult)
    return res.status(404).json({ error: "schedule not found!" });

  res.status(201).json(updateResult[scheduleName][0]);
};

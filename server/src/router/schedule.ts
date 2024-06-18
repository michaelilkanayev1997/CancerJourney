import { Router } from "express";

import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { addAppointment, addMedication } from "#/controllers/schedule";
import { AppointmentSchema, MedicationSchema } from "#/utils/validationSchema";

const schedule = Router();

schedule.post(
  "/add-appointment",
  mustAuth,
  validate(AppointmentSchema),
  addAppointment
);
schedule.post(
  "/add-medication",
  mustAuth,
  validate(MedicationSchema),
  addMedication
);

export default schedule;

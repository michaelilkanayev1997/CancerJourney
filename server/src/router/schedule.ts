import { Router } from "express";

import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  addAppointment,
  addMedication,
  getSchedule,
  scheduleRemove,
  updateSchedule,
} from "#/controllers/schedule";
import { AppointmentSchema, MedicationSchema } from "#/utils/validationSchema";
import { medicationPhotoUpload } from "#/middleware/fileUpload";
import { parseSpecificDaysAndDate } from "#/middleware/schedule";

const router = Router();

router.post(
  "/add-appointment",
  mustAuth,
  validate(AppointmentSchema),
  addAppointment
);
router.post(
  "/add-medication",
  mustAuth,
  medicationPhotoUpload.single("file"),
  parseSpecificDaysAndDate,
  validate(MedicationSchema),
  addMedication
);
router.get("/:schedulename", mustAuth, getSchedule);
router.delete("/schedule-delete", mustAuth, scheduleRemove);
router.patch(
  "/appointment-update",
  mustAuth,
  validate(AppointmentSchema),
  updateSchedule
);
router.patch(
  "/medication-update",
  mustAuth,
  validate(MedicationSchema),
  updateSchedule
);

export default router;

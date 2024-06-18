import { Router } from "express";

import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  addAppointment,
  addMedication,
  getSchedule,
  scheduleRemove,
} from "#/controllers/schedule";
import { AppointmentSchema, MedicationSchema } from "#/utils/validationSchema";

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
  validate(MedicationSchema),
  addMedication
);
router.get("/:schedulename", mustAuth, getSchedule);
router.delete("/file-delete", mustAuth, scheduleRemove);

export default router;

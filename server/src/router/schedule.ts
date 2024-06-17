import { Router } from "express";

import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { addAppointment } from "#/controllers/schedule";

const schedule = Router();

schedule.post("/add-appointment", mustAuth, addAppointment);

export default schedule;

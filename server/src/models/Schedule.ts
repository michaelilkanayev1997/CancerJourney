import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAppointment extends Document {
  _id: ObjectId;
  location: string;
  time: Date;
  type: string;
  notes?: string;
}

export interface IMedication extends Document {
  _id: ObjectId;
  name: string;
  frequency: string;
  timesPerDay?: string;
  specificDays?: string;
  prescriber?: string;
  notes?: string;
}

interface IUserSchedule extends Document {
  owner: ObjectId;
  appointments: IAppointment[];
  medications: IAppointment[];
}

const AppointmentSchema: Schema = new Schema({
  location: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  notes: { type: String },
});

const MedicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  frequency: { type: String },
  timesPerDay: { type: String },
  specificDays: { type: String },
  prescriber: { type: String },
  notes: { type: String },
});

const UserScheduleSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appointments: [AppointmentSchema],
  medications: [MedicationSchema],
});

export const Schedule = mongoose.model<IUserSchedule>(
  "Schedule",
  UserScheduleSchema
);

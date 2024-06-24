import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAppointment {
  _id: ObjectId;
  title: string;
  location: string;
  date: Date;
  notes?: string;
  reminder: string;
}

export interface IMedication extends Document {
  _id: ObjectId;
  name: string;
  frequency: string;
  timesPerDay?: string;
  specificDays?: string[];
  prescriber?: string;
  notes?: string;
  date: Date;
  photo?: { url: string; publicId: string };
}

interface IUserSchedule extends Document {
  owner: ObjectId;
  appointments: IAppointment[];
  medications: IMedication[];
  [key: string]: any; // index signature
}

const AppointmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  reminder: { type: String },
});

const MedicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  frequency: { type: String },
  timesPerDay: { type: String },
  specificDays: { type: [String] },
  prescriber: { type: String },
  notes: { type: String },
  date: { type: Date, required: true },
  photo: {
    type: Object,
    url: String,
    publicId: String,
  },
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

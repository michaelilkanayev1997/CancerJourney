import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAppointment extends Document {
  _id: ObjectId;
  location: string;
  time: Date;
  type: string;
  notes?: string;
}

interface IUserSchedule extends Document {
  owner: ObjectId;
  bloodtests: IAppointment[];
  treatments: IAppointment[];
}

const AppointmentSchema: Schema = new Schema({
  location: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  notes: { type: String },
});

const UserScheduleSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appointments: [AppointmentSchema],
  medications: [AppointmentSchema],
});

export const Schedule = mongoose.model<IUserSchedule>(
  "Schedule",
  UserScheduleSchema
);

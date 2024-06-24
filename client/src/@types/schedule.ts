import { ObjectId } from "mongoose";

export interface IAppointment {
  _id: ObjectId;
  title: string;
  location: string;
  date: Date;
  reminder: string;
  notes?: string;
}

export interface IMedication {
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

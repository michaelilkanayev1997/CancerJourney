import { ObjectId } from "mongoose";

export interface IAppointment {
  _id: ObjectId;
  title: string;
  location: string;
  date: Date;
  reminder: string;
  notes?: string;
}

import mongoose from "mongoose";

import { MONGO_URI } from "../utils/variables";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log("db connection failed : ", err);
  });

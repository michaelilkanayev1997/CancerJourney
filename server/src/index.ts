import express from "express";
import "dotenv/config";
import "express-async-errors";
import "./db";

import authRouter from "./router/auth";
import fileRouter from "./router/file";
import scheduleRouter from "./router/schedule";
import postsRouter from "./router/post";
import postReportRouter from "./router/postReport";
import profileRouter from "./router/profile";

import { errorHandler } from "./middleware/error";

const app = express();

// register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/schedule", scheduleRouter);
app.use("/post", postsRouter);
app.use("/post-report", postReportRouter);
app.use("/profile", profileRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("port is listening on port " + PORT);
});

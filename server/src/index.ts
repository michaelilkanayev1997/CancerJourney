import express from "express";
import "dotenv/config";
import "express-async-errors";
import "./db";
import cors from "cors";

import authRouter from "./router/auth";
import fileRouter from "./router/file";
import scheduleRouter from "./router/schedule";
import postsRouter from "./router/post";
import postReportRouter from "./router/postReport";
import replyReportRouter from "./router/replyReport";
import profileRouter from "./router/profile";

import { errorHandler } from "./middleware/error";

const app = express();

// Enable CORS for all origins or specify allowed origins
app.use(
  cors({
    origin: "*", // Use '*' to allow all origins or specify the client's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/schedule", scheduleRouter);
app.use("/post", postsRouter);
app.use("/post-report", postReportRouter);
app.use("/reply-report", replyReportRouter);
app.use("/profile", profileRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("port is listening on port " + PORT);
});

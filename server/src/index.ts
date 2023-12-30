import express from "express";
import "dotenv/config";
import "./db";

import authRouter from "./router/auth";

const app = express();

// register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("port is listening on port " + PORT);
});

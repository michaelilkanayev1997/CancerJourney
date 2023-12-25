import express from "express";
import "dotenv/config";
import "./db";

const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("port is listening on port " + PORT);
});

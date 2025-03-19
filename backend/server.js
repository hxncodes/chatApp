import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to root route");
});

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});

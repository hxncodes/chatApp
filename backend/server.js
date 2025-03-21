import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import dbConnection from "./db/dbConnection.js";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the root route");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start server and establish DB connection
app.listen(port, async () => {
  try {
    // Connect to DB
    await dbConnection();

    // Log success messages
    console.log(chalk.green.bold(`Server is up and running on port ${port}`));
  } catch (error) {
    // Log error messages in case of a failure
    console.log(
      chalk.red.bold(`Error: Failed to start the server. ${error.message}`)
    );
  }
});

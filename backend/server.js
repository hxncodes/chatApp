import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import authRoutes from "./routes/auth.routes.js";
import dbConnection from "./db/dbConnection.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the root route");
});

// Auth Routes
app.use("/api/auth", authRoutes);

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

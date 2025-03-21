import mongoose from "mongoose";
import chalk from "chalk";

const dbConnection = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGO_DB_URI);

    // Log success message when connected to MongoDB
    console.log(chalk.yellow.bold("Connected to MongoDB successfully"));
  } catch (error) {
    // Log failure message in red with error details
    console.log(
      chalk.red.bold(`Error connecting to MongoDB: ${error.message}`)
    );
  }
};

export default dbConnection;

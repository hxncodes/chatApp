import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import chalk from "chalk";

const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the JWT from the cookies
    const token = req.cookies.jwt;

    // Check if token is provided in the request
    if (!token) {
      console.log(chalk.red.bold("Authorization failed: No token provided"));
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is valid and decoded successfully
    if (!decoded) {
      console.log(chalk.red.bold("Authorization failed: Invalid token"));
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Find the user by the decoded userId
    const user = await User.findById(decoded.userId).select("-password");

    // If user is not found
    if (!user) {
      console.log(
        chalk.yellow.bold(`User not found for ID: ${decoded.userId}`)
      );
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user object to the request object for further use in routes
    req.user = user;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error(
      chalk.red.bold(`Error in protectRoute middleware: ${error.message}`)
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;

import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    // req.user is coming from protectedRoute middleware
    const loggedInUserId = req.user._id;

    // Fetch all users except the logged-in user, excluding the password field
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUserForSidebar controller:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

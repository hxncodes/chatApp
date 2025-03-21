import jwt from "jsonwebtoken";

// Generate and set the JWT token in a secure, HTTP-only cookie
const generateTokenAndSetCookies = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15d", // Token expiry
    });

    // Set the token in an HTTP-only cookie with secure settings
    res.cookie("jwt", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      sameSite: "Strict", // Mitigate CSRF attacks
      maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expiration (15 days in milliseconds)
    });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

// const generateTokenAndSetCookies = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "15d",
//   });

//   res.cookie("jwt", token, {
//     maxAge: 15 * 24 * 60 * 60 * 1000, // ms
//     httpOnly: true, // prevent XSS attacks cross-site scripting attacks
//     sameSite: "strict", // CSRF attacks cross-site request forgery attacks
//     secure: process.env.NODE_ENV !== "development"
//   });
// };

export default generateTokenAndSetCookies;

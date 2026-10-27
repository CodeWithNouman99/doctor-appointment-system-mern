import jwt from "jsonwebtoken";

// User authentication middleware
// It checks the token before letting the request reach the controller
const authUser = async (req, res, next) => {
  try {
    // The user token comes in the "token" header (admin uses "atoken")
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized, login again" });
    }

    // Checking the token is real and not expired, then reading the user id from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Everything is fine, go to the next function (the controller)
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;

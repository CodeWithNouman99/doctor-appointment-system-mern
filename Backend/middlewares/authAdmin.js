import jwt from "jsonwebtoken";


//Admin authentication middleware
const authAdmin =async (req, res, next) => {
  try {
    const {atoken} = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
   if(!decoded || decoded.email !== process.env.ADMIN_EMAIL || decoded.password !== process.env.ADMIN_PASSWORD){
    return res.json({
      success: false,
      message: "Invalid token",
    });
   }
   next();
  } catch (error) {
    res.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authAdmin;

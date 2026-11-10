import jwt from "jsonwebtoken";


//User authentication middleware
const authUser =async (req, res, next) => {
  try {
    const {token} = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   if(!decoded || decoded.email !== process.env.ADMIN_EMAIL || decoded.password !== process.env.ADMIN_PASSWORD){
    req.body.userId=decoded.id;
    next();
   }
  } catch (error) {
    res.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;

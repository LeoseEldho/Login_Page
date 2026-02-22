import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login again",
      });
    }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
      }
    //sending decoded id to the req.userId so data Can Use;
    req.userId = decoded.id
    
    next();
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
export default userAuth;


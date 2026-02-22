import express from "express";
import {
  userRegister,
  userLogin,
  logout,
  sendOTP,
  verifyEmail,
  changePassword,
  setPassword
} from "../controllers/userController.js"; //Make sure file is named userController.js
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", logout);
router.post("/sentOTP", userAuth, sendOTP);
router.post("/verifyEmail", userAuth, verifyEmail);
router.post("/changepassword", changePassword);
router.post('/setPassword',setPassword)

export default router;

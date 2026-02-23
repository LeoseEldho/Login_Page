import bcrypts from "bcryptjs";
import User from "../models/user.js"; //Make sure file is named user.js
import jwt from "jsonwebtoken";
import transporter from "../emailDesign/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../emailDesign/emailTemp.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypts.genSalt(10);
    const hash = await bcrypts.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hash,
    });

    // send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      name: name,
    });

    // send email by non-blocking
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `Welcome to our Website ${name}`,
        text: `Hello ${name}, your account has been created successfully.`,
      });
    } catch (mailErr) {
      console.error("Email failed:", mailErr.message);
    }
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Email" });
    }
    const isPassword = await bcrypts.compare(password, user.password);
    if (!isPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Sending token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // MUST be true on Vercel
      sameSite: "none", // MUST be none for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(202).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerifyedUSer: user.isVerifyedUSer,
      },
      message: `Welcome ${user.name}`,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Something Went Wrong!" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    return res
      .status(404)
      .json({ success: false, message: "Somthing Went Wrong", err });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const userData = req.userId;

    const user = await User.findById(userData);
    if (!user) {
      res.status(400).json({ success: false, message: "User Not found!!!" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.expireyOtp = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: " Account Varifying Process",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email,
      ),
    });
    res.status(202).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId;

    if (!otp) {
      return res.status(401).json({ success: false, message: "enter the otp" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User NOt Found!!" });
    }

    if (user.otp !== String(otp)) {
      return res
        .status(401)
        .json({ success: false, message: "OTP is invalid" });
    }
    if (user.expireyOtp < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerifyedUSer = true;
    user.otp = null;
    user.expireyOtp = 0;
    await user.save();

    res.status(202).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerifyedUSer: user.isVerifyedUSer,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ success: false, message: "something went Wrong ", error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Having Account!" });
    }
    const newOTp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOTp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset OTP",
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", user.otp).replace(
          "{{email}}",
          user.email,
        ),
      });
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ success: false, message: "Mail filed to Deliver" });
    }
    return res
      .status(200)
      .json({ success: true, message: "OTP has sented Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, err: err });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { email, otp, Password } = req.body;
    console.log(email, otp, Password);
    if (!email || !otp || !Password) {
      return res.status(401).json({ success: false, message: "enter details" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Found!" });
    }
    console.log(user.otp, otp);
    if (user.otp !== String(otp)) {
      return res
        .status(401)
        .json({ success: false, message: "OTP not Matching " });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
    const salt = await bcrypts.genSalt(10);
    const hash = await bcrypts.hash(Password, salt);

    user.password = hash;
    user.otp = null;
    user.resetOtpExpireAt = null;
    await user.save();

    console.log("fooling");
    res
      .status(200)
      .json({ success: true, message: "Password Changed Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ success: false, message: "Something Occure" });
  }
};

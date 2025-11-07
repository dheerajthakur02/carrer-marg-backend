import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import College from "../models/college.model.js";
import Student from "../models/student.model.js";
import jwt from "jsonwebtoken";
import { internalServerErrorMessage } from "../utils/responseMessage.js";
export const setCookie = (res, token) => {
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, role, email, mobile, password, ...profileData } = req.body;
    if (!name || !mobile || !password || !role) {
      return res.status(400).json({
        message: "name, password, mobile, and password are required",
        success: false,
      });
    }
    const alreadyPresentUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (alreadyPresentUser) {
      return res.status(400).json({
        message: "User with this creditional already existed!!",
        success: false,
      });
    }

    const user = new User({
      name,
      role,
      email,
      mobile,
      password,
    });
    await user.save();

    let profile;
    if (role === "student") {
      profile = await Student.create({
        userId: user.id,
        fullName: user.name || profileData?.fullName,
        ...profileData,
      });
    } else if (role == "college") {
      profile = await Organization.create({
        userId: user.id,
        type: role,
        ...profileData,
      });
    } else {
      return res.status(400).json({
        message: "Invalid role",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: { user, profile },
    });
  } catch (error) {
    internalServerErrorMessage(res, error);
  }
};

export const loginWithPassword = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    if (!email && !mobile) {
      return res
        .status(400)
        .json({ message: "Email or mobile is required", success: false });
    }

    const user = await User.findOne({
      $or: [{ mobile }, { email }],
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    let profile = null;
    if (user.role == "student") {
      profile = await Student.findOne({ userId: user.id });
    } else if (user.role == "college") {
      profile = await College.findOne({ userId: user.id });
    }
    const token = generateToken(user.id, user.role);
    setCookie(res, token);

    return res.status(200).json({
      message: `Login successfully! Welcome ${profile.name || user.name}`,
      profile,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

export const logout = (req, res) => {
  try {
    const role = req.user.role;
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: `${role} has been logged out successfully`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const role = req.user.role;
    let profile;
    if (role == "student") {
      profile = await Student.findOne({ userId: id });
    } else if (role == "college") {
      profile = await College.findOne({ userId: id });
    } else if (role == "super-admin") {
      profile = await User.findOne({ id });
    }
    return res.status(200).json({
      message: `${role} data fecthed successfully`,
      profile,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

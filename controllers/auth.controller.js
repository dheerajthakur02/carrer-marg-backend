import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import setCookie from "../utils/setCookie.js";

export const register = async (req, res) => {
  try {
    const { name, role, email, mobile, password, ...profileData } = req.body;

    if (!name || !mobile || !password || !role) {
      return res.status(400).json({
        message: "name, mobile, password, and role are required",
        success: false,
      });
    }
    const alreadyPresentUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (alreadyPresentUser) {
      return res.status(400).json({
        message: "User with this email or mobile already exists!",
        success: false,
      });
    }
    const user = new User({
      name,
      role,
      email,
      mobile,
      password,
      ...profileData,
    });
    await user.save();
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

export const loginWithPassword = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({
        message: "Email or mobile is required",
        success: false,
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }

    const token = generateToken(user.id, user.role);
    setCookie(res, token);

    return res.status(200).json({
      message: `Login successful! Welcome ${user.name}`,
      user,
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
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: `${req?.user?.role || "User"} has been logged out successfully`,
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
    const user = await User.findOne({ id });
    return res.status(200).json({
      message: `${role} profile fetched successfully`,
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

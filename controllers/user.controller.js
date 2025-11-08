import User from "../models/user.model.js";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "user id is required",
      });
    }

    const updatedUser = await User.findOneAndUpdate({ id }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      gender,
      city,
      state,
      role,
      id,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = { status: "active" };

    if (role) {
      filter.role = role;
    }

    if (id && id.trim() !== "") {
      if (!role) {
        return res
          .status(400)
          .json({ message: "role is required", success: "false" });
      }
      if (role == "agent") filter.enrolledBy = id;
      else if (role == "student") filter.id = id;
    }

    if (req.user?.role == "agent") {
      filter.enrolledBy = req.user.role;
    }
    if (state) filter.state = { $regex: state, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (gender) filter.gender = { $regex: gender, $options: "i" };

    if (search) {
      filter.$or = [{ fullName: { $regex: search, $options: "i" } }];
    }
    const pipeline = [
      { $match: filter },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          email: 1,
          role: 1,
          mobile: 1,
          gender: 1,
          dob: 1,
          address: 1,
          city: 1,
          state: 1,
        },
      },
    ];

    if (limitNum > 0) {
      pipeline.push({ $skip: (pageNum - 1) * limitNum });
      pipeline.push({ $limit: limitNum });
    }

    const users = await User.aggregate(pipeline);
    const totalusers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "users fetched successfully",
      data: users,
      totalusers,
      currentPage: limitNum < 0 ? 1 : pageNum,
      totalPages: limitNum > 0 ? Math.ceil(totalusers / limitNum) : 1,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

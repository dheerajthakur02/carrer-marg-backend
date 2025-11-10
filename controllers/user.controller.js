import User from "../models/user.model.js";
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const pipeline = [];
    const filter = {};
    const role = req.user.role;

    if (["super-admin", "agent"].includes(role)) {
      const user = await User.findOne({ id });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User data not found!!",
        });
      }
      if (
        (user.role == "student" && role == "super-admin") ||
        (user.role == "student" && user.enrolledBy == req.user.id)
      ) {
        return res.status(200).json({
          success: true,
          message: "Student data fetched successfully",
          data: user,
        });
      } else if (user.role == "student" && user.enrolledBy != req.user.id) {
        return res.status(404).json({
          success: false,
          message: "Student data not found!!",
        });
      } else if (user.role == "super-admin") {
        return res.status(400).json({
          success: false,
          message: "Confidential",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Not Authorised",
      });
    }
    const data = [];
    if (["agent", "super-admin"].includes(role) && id) {
      const agentId = role == "agent" ? req.user.id : id;
      filter.enrolledBy = agentId;
      pipeline.push(
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
        }
      );
      if (role == "super-admin") {
        const agent = await User.findOne({ id: agentId });
        data.push({ "Agent Profile": agent });
      }
    }
    const students = await User.aggregate(pipeline);
    data.push({ "all enrolled students": students });
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
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
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = { status: "active" };

    if (req.user?.role == "agent") {
      filter.enrolledBy = req.user.id;
    }
    if (req.user?.role == "super-admin" && role) {
      filter.role = role;
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

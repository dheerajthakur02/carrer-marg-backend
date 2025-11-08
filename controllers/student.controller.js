import Student from "../models/student.model.js";

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
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
        message: "Student ID is required",
      });
    }

    const updatedStudent = await Student.findOneAndUpdate({ id }, updateData, {
      new: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student details updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      gender,
      city,
      state,
      agentId,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = { status: "active" };

    if (agentId && agentId.trim() !== "") {
      filter.enrolledBy = agentId;
    }

    if (req.user.role == "agent") {
      filter.enrolledBy = req.user.id;
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
          userId: 1,
          fullName: 1,
          gender: 1,
          dob: 1,
          address: 1,
          city: 1,
          state: 1,
          country: 1,
        },
      },
    ];

    if (limitNum > 0) {
      pipeline.push({ $skip: (pageNum - 1) * limitNum });
      pipeline.push({ $limit: limitNum });
    }

    const students = await Student.aggregate(pipeline);
    const totalStudents = await Student.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
      totalStudents,
      currentPage: limitNum < 0 ? 1 : pageNum,
      totalPages: limitNum > 0 ? Math.ceil(totalStudents / limitNum) : 1,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

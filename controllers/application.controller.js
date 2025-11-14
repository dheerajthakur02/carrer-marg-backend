import Application from "../models/application.model.js";
import College from "../models/college.model.js ";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const studentApply = async (req, res) => {
  try {
    const {
      collegeId,
      courseId,
      tenthBoardName,
      tenthObtainedMarks,
      tenthFullMarks,
      twelfthBoardName,
      twelfthObtainedMarks,
      twelfthFullMarks,
      examName,
      examRank,
      examMarks,
      category,
      fathername,
      fatherOccupation,
      motherName,
      motherOccupation,
    } = req.body;
    const id = req.user.id;

    const college = await College.findOne({ id: collegeId });
    if (!college) {
      return res
        .status(404)
        .json({ message: "college not found", success: false });
    }

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res
        .status(404)
        .json({ message: "course not found", success: false });
    }
    const data = await User.findOne({ id: studentId });
    const exists = await Application.findOne({
      studentId: id,
      collegeId,
      courseId,
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Already applied for this course", success: false });
    }

    data.father.name = fathername;
    data.father.occupation = fatherOccupation;
    data.mother.name = motherName;
    data.mother.occupation = motherOccupation;
    await data.save();
    const app = await Application.create({
      studentId: id,
      collegeId,
      courseId,
      appliedBy: req.user.role,
      educationTenth: {
        boardName: tenthBoardName,
        obtainedMarks: tenthObtainedMarks,
        fullMarks: tenthFullMarks,
      },
      educationtwelfth: {
        boardName: twelfthBoardName,
        obtainedMarks: twelfthObtainedMarks,
        fullMarks: twelfthFullMarks,
      },
      exam: {
        name: examName,
        rank: examRank,
        marks: examMarks,
        category: category,
      },
    });

    res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      data: app,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const agentApply = async (req, res) => {
  try {
    const {
      studentId,
      collegeId,
      courseId,
      tenthBoardName,
      tenthObtainedMarks,
      tenthFullMarks,
      twelfthBoardName,
      twelfthObtainedMarks,
      twelfthFullMarks,
      examName,
      examRank,
      examMarks,
      category,
      fathername,
      fatherOccupation,
      motherName,
      motherOccupation,
    } = req.body;
    if (!studentId || !collegeId || !courseId) {
      return res.json(400).json({
        message: "some feilds are missing.",
        success: false,
      });
    }
    const id = req.user.id;
    const user = await User.findOne({ id: studentId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Student not found", success: false });
    }
    const college = await College.findOne({ id: collegeId });
    if (!college) {
      return res
        .status(404)
        .json({ message: "College not found", success: false });
    }
    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }

    const exists = await Application.findOne({
      studentId,
      collegeId,
      courseId,
    });
    if (exists)
      return res
        .status(400)
        .json({ message: "Already applied for this course", success: false });

    user.father.name = fathername;
    user.father.occupation = fatherOccupation;
    user.mother.name = motherName;
    user.mother.occupation = motherOccupation;
    await user.save();
    const app = await Application.create({
      studentId,
      collegeId,
      courseId,
      appliedBy: "agent",
      appliedThrough: id,
      educationTenth: {
        boardName: tenthBoardName,
        obtainedMarks: tenthObtainedMarks,
        fullMarks: tenthFullMarks,
      },
      educationtwelfth: {
        boardName: twelfthBoardName,
        obtainedMarks: twelfthObtainedMarks,
        fullMarks: twelfthFullMarks,
      },
      exam: {
        name: examName,
        rank: examRank,
        marks: examMarks,
        category: category,
      },
      category,
    });
    user.enrolledBy = id;
    await user.save();
    res.status(201).json({
      message: `Application of Student named ${user.name} submitted successfully!! in ${college.name} in ${course.name}`,
      success: true,
      data: app,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const id = req.user.id;
    const role = req.user.role;
    const pipeline = [
      { $match: { id: applicationId } },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "id",
          as: "student",
        },
      },
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "colleges",
          localField: "collegeId",
          foreignField: "id",
          as: "college",
        },
      },
      { $unwind: { path: "$college", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "id",
          as: "course",
        },
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: 1,
          applicationId: 1,
          studentId: 1,
          studentName: "$student.name",
          passportSizePhoto: 1,
          email: "$student.email",
          mobile: "$student.mobile",
          category: 1,
          address: "$student.address",
          city: "$student.city",
          state: "$student.state",
          address: "$student.address",
          fatherName: "$student.father.name",
          fatherOccupation: "$student.father.occupation",
          motherName: "$student.mother.name",
          motherOccupation: "$student.mother.occupation",
          educationTenth: 1,
          educationtwelfth: 1,
          exam: 1,
          tenthMarksheet: 1,
          tenthPassingCertificate: 1,
          twlefthMarksheet: 1,
          twlefthPassingCertificate: 1,
          createdAt: 1,
          updatedAt: 1,
          appliedThrough: 1,
        },
      },
    ];
    const application = await Application.aggregate(pipeline);

    if (!application) {
      return res.status(404).json({
        message: "application not found",
        success: false,
      });
    }
    if (
      (role == "student" && application[0].studentId == id) ||
      (role == "agent" && application[0].appliedThrough == id) ||
      role == "super-admin"
    ) {
      res.status(200).json({
        success: true,
        message: "Application fetched successfully",
        data: application[0],
      });
    } else {
      return res.status(404).json({
        message: "application not found",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      studentId,
      collegeId,
      courseId,
      appliedBy,
      appliedThrough,
      status,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = {};

    if (req.user.role == "student") {
      filter.studentId = req.user.id;
    }
    if (req.user.role == "agent") {
      filter.appliedThrough = req.user.id;
    }
    if (req.user.role == "super-admin") {
      if (studentId) filter.studentId = studentId;
      if (appliedBy) filter.appliedBy = { $regex: appliedBy, $options: "i" };
      if (appliedThrough) filter.appliedThrough = appliedThrough;
    }
    if (collegeId) filter.collegeId = collegeId;
    if (courseId) filter.courseId = courseId;
    if (status) filter.status = { $regex: status, $options: "i" };
    const pipeline = [
      { $match: filter },
      {
        $project: {
          _id: 0,
          id: 1,
          applicationId: 1,
          studentId: 1,
          collegeId: 1,
          courseId: 1,
          appliedBy: 1,
          status: 1,
          address: 1,
          appliedThrough: 1,
        },
      },
    ];

    if (limitNum > 0) {
      pipeline.push({ $skip: (pageNum - 1) * limitNum });
      pipeline.push({ $limit: limitNum });
    }

    const applications = await Application.aggregate(pipeline);
    const totalApplications = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "applications fetched successfully",
      data: applications,
      totalApplications,
      currentPage: limitNum < 0 ? 1 : pageNum,
      totalPages: limitNum > 0 ? Math.ceil(totalApplications / limitNum) : 1,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

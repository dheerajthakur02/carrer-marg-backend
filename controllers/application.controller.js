import Application from "../models/application.model.js";
import Student from "../models/student.model.js";
import College from "../models/college.model.js ";
// 🎓 Student applies
export const studentApply = async (req, res) => {
  try {
    const { collegeId, courseId } = req.body;
    const studentUserId = req.user.id;

    const student = await Student.findOne({ userId: studentUserId });
    if (!student)
      return res
        .status(404)
        .json({ message: "Student profile not found", success: false });

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
   
    const exists = await Application.findOne({
      studentId: student.id,
      collegeId,
      courseId,
    });
    if (exists)
      return res
        .status(400)
        .json({ message: "Already applied for this course", success: false });

    const app = await Application.create({
      studentId: student.id,
      collegeId,
      courseId,
      appliedBy: "student",
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

// 🧑‍💼 Agent applies for student
export const agentApply = async (req, res) => {
  try {
    const { studentId, collegeId, courseId } = req.body;
    const agentId = req.user.id;

    const exists = await Application.findOne({
      studentId,
      collegeId,
      courseId,
    });
    if (exists)
      return res
        .status(400)
        .json({ message: "Already applied for this course", success: false });

    const app = await Application.create({
      studentId,
      collegeId,
      courseId,
      appliedBy: "agent",
      appliedThrough: agentId,
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

// 📋 View all applications (student)
export const getStudentApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    const apps = await Application.find({ studentId: student.id });
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 📋 View all applications (agent)
export const getAgentApplications = async (req, res) => {
  try {
    const students = await Student.find({ agentAssigned: req.user.id });
    const ids = students.map((s) => s.id);
    const apps = await Application.find({ studentId: { $in: ids } });
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

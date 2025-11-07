import Agent from "../models/agent.model.js";
import Student from "../models/student.model.js";
import Application from "../models/application.model.js";

// 🧩 1️⃣ Get all unassigned students
export const getUnassignedStudents = async (req, res) => {
  try {
    const students = await Student.find({ agentAssigned: { $exists: false } });
    res.status(200).json({
      message: "Unassigned students fetched successfully",
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🧩 2️⃣ Assign a student to this agent
export const assignStudentToAgent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const agentId = req.user.id; // current logged-in agent

    const student = await Student.findOne({ id: studentId });
    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found", success: false });
    }

    if (student.agentAssigned) {
      return res
        .status(400)
        .json({
          message: "Student already assigned to an agent",
          success: false,
        });
    }

    // Update student document
    student.agentAssigned = agentId;
    await student.save();

    // Update agent document
    await Agent.findOneAndUpdate(
      { userId: agentId },
      {
        $push: { assignedStudents: { studentId } },
        $inc: { totalStudentsHandled: 1 },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Student assigned successfully to agent",
      success: true,
      studentId,
      agentId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🧩 3️⃣ Get all students assigned to this agent
export const getAssignedStudents = async (req, res) => {
  try {
    const agentId = req.user.id;
    const students = await Student.find({ agentAssigned: agentId });

    res.status(200).json({
      message: "Assigned students fetched successfully",
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🧩 4️⃣ Get all applications of assigned students
export const getAssignedApplications = async (req, res) => {
  try {
    const agentId = req.user.id;
    const students = await Student.find({ agentAssigned: agentId });
    const studentIds = students.map((s) => s.id);

    const applications = await Application.find({
      studentId: { $in: studentIds },
    });

    res.status(200).json({
      message: "Applications of assigned students fetched successfully",
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

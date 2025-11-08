import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res
        .status(400)
        .json({ message: "Course name is missing!!", success: false });
    }
    const already = await Course.findOne({ name: data.name });
    if (already) {
      return res
        .status(404)
        .json({ message: "course already present", success: false });
    }

    const course = await Course.create(data);
    await course.save();
    res.status(201).json({
      message: "Course added successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "active" });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Course.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    res.status(200).json({
      message: "Course updated successfully",
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findOneAndDelete({ id });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    res
      .status(200)
      .json({ message: "Course deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

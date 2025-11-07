import College from "../models/college.model.js";

export const createCollege = async (req, res) => {
  try {
    const data = req.body;
    const existing = await College.findOne({
      name: data?.name,
      email: data?.email,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "College already exists", success: false });
    }

    const college = await College.create(data);
    res.status(201).json({
      message: "College added successfully",
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 📋 Get all colleges
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({ status: "active" });
    res.status(200).json({ success: true, data: colleges });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🔍 Get single college by ID
export const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findOne({ id });
    if (!college)
      return res
        .status(404)
        .json({ message: "College not found", success: false });

    res.status(200).json({ success: true, data: college });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ✏️ Update college
export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await College.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ message: "College not found", success: false });

    res
      .status(200)
      .json({ message: "College updated", success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🗑️ Delete college
export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await College.findOneAndDelete({ id });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "College not found", success: false });

    res
      .status(200)
      .json({ message: "College deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

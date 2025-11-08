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

export const getAllColleges = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type, state, city } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = { status: "active" };

    if (type) filter.type = type;
    if (state) filter.state = { $regex: state, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { affiliation: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
      ];
    }

    const pipeline = [
      { $match: filter },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          type: 1,
          affiliation: 1,
          city: 1,
          state: 1,
          avgFees: 1,
          avgRating: 1,
          totalStudents: 1,
          totalCourses: 1,
          scholarshipAvailable: 1,
          views: 1,
          email: 1,
          phone: 1,
          website: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    if (limitNum > 0) {
      pipeline.push({ $skip: (pageNum - 1) * limitNum });
      pipeline.push({ $limit: limitNum });
    }

    const colleges = await College.aggregate(pipeline);
    const totalColleges = await College.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Colleges fetched successfully",
      data: colleges,
      totalColleges,
      currentPage: limitNum < 0 ? 1 : pageNum,
      totalPages: limitNum > 0 ? Math.ceil(totalColleges / limitNum) : 1,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

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

export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, ...updateData } = req.body;

    // 1️⃣ Find the college by ID
    const college = await College.findOne({ id });
    if (!college) {
      return res
        .status(404)
        .json({ message: "College not found", success: false });
    }

    Object.assign(college, updateData);
    await college.save();

    if (courseId) {
      const alreadyExists = college.courses.some(
        (course) => course.courseId === courseId
      );
      if (!alreadyExists) {
        college.courses.push({ courseId });
        await college.save();
      }
    }

    res.status(200).json({
      message: "College updated successfully",
      success: true,
      data: college,
    });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

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

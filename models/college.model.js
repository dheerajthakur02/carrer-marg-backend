import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const collegeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `college-${uuidv4()}`,
    },
    name: {
      type: String,
      required: true,
    },
    establishedYear: {
      type: Number,
    },
    type: {
      type: String,
      enum: ["private", "government", "deemed", "autonomous"],
    },
    affiliation: {
      type: String, // e.g., AICTE, UGC, etc.
    },
    logo: {
      type: String, // URL or Firebase path
    },
    coverImage: {
      type: String,
    },

    // 📍 Location Info
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      default: "India",
    },
    pincode: {
      type: String,
    },

    // 📚 Courses Offered
    courses: [
      {
        courseId: { type: String },
      },
    ],

    // 💸 Fee & Scholarship Info
    avgFees: {
      type: Number,
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    scholarshipDetails: {
      type: String,
    },

    // 🏠 Facilities
    facilities: [
      {
        type: String, // e.g., Hostel, Library, Sports Complex
      },
    ],

    // 🧾 Admission Process
    admissionProcess: {
      type: String,
    },
    applicationLink: {
      type: String,
    },
    brochure: {
      type: String,
    },

    // ⭐ Reviews & Ratings
    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // 👥 Interaction Info
    totalStudents: {
      type: Number,
      default: 0,
    },
    totalCourses: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },

    // 📞 Contact Details
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },

    // ✅ Status
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Transform output (hide internal fields)
collegeSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("college", collegeSchema);

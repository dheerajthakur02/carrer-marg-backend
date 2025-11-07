import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const courseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `course-${uuidv4()}`,
    },

  
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      enum: ["UG", "PG", "Diploma", "PhD", "Certificate"],
      required: true,
    },
    duration: {
      type: String, // e.g., "4 Years", "2 Years", "6 Months"
    },
    category: {
      type: String, // e.g., "Engineering", "Management", "Medical"
    },
    specialization: {
      type: String, // e.g., "Computer Science", "Marketing"
    },
    eligibility: {
      type: String, // e.g., "10+2 with PCM", "Graduate in any stream"
    },

    // 🧾 Admission Info
    entranceExams: [
      {
        type: String, // e.g., "JEE Main", "NEET", "CAT"
      },
    ],
    admissionProcess: {
      type: String,
    },

    // 💰 Fees Info
    averageFees: {
      type: Number,
    },
    feesRange: {
      min: { type: Number },
      max: { type: Number },
    },

    // 🏫 College Relation
    collegeIds: [
      {
        type: String, // Stores IDs of colleges offering this course
      },
    ],

    // 📚 Course Details
    syllabus: {
      type: String, // Text or file link
    },
    highlights: [
      {
        type: String,
      },
    ],
    placementInfo: {
      type: String, // Description about placements, top recruiters, avg package
    },

    // 🌟 Popularity Metrics
    totalColleges: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },

    // ✅ Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Clean JSON output
courseSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("courses", courseSchema);

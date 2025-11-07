import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const studentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `student-${uuidv4()}`,
    },

    userId: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: {
      type: Date,
    },
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

    tenthPercentage: {
      type: Number,
    },
    twelfthPercentage: {
      type: Number,
    },
    graduationPercentage: {
      type: Number,
    },
    courseInterested: {
      type: String,
    },
    stream: {
      type: String,
    },
    entranceExam: {
      type: String,
    },
    entranceScore: {
      type: Number,
    },
    passingYear: {
      type: Number,
    },

    appliedColleges: [
      {
        collegeId: { type: String },
        applicationStatus: {
          type: String,
          enum: ["applied", "shortlisted", "rejected", "accepted"],
          default: "applied",
        },
      },
    ],

    preferredCity: {
      type: String,
    },
    preferredCourseLevel: {
      type: String,
    },
    budgetRange: {
      min: { type: Number },
      max: { type: Number },
    },

    counselorAssigned: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("students", studentSchema);

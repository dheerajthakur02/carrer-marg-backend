import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import generateApplicationNumber from "../utils/generateApplicationNumber.js";
const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `application-${uuidv4()}`,
    },
    applicationId: {
      type: String,
      default: generateApplicationNumber(),
    },
    studentId: {
      type: String,
      required: true,
    },
    collegeId: [],
    courseId: {
      type: String,
      required: true,
    },
    appliedBy: {
      type: String,
      enum: ["student", "agent"],
      required: true,
    },
    appliedThrough: {
      type: String,
    },
    status: {
      type: String,
      enum: ["applied", "reviewing", "accepted", "rejected"],
      default: "applied",
    },

    remarks: String,
    educationTenth: {
      boardName: String,
      obtainedMarks: String,
      fullMarks: String,
    },

    educationtwelfth: {
      boardName: String,
      obtainedMarks: String,
      fullMarks: String,
    },
    exam: {
      name: String,
      rank: String,
      marks: String,
      category: String,
    },
    tenthMarksheet: {
      type: String,
    },
    tenthPassingCertificate: {
      type: String,
    },
    twlefthMarksheet: {
      type: String,
    },
    twlefthPassingCertificate: {
      type: String,
    },
    passportSizePhoto: {
      type: String,
    },
    aadharCard: {
      type: String,
    },
    religion: String,
  },
  { timestamps: true }
);

applicationSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("Application", applicationSchema);

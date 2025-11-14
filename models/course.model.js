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
    level: {
      type: String,
      enum: ["UG", "PG", "Diploma", "PhD", "Certificate"],
      required: true,
    },
    duration: {
      type: String,
    },
    eligibility: {
      type: String,
    },

    entranceExams: [
      {
        type: String,
      },
    ],
    admissionProcess: {
      type: String,
    },
    averageFees: {
      type: Number,
    },
    feesRange: {
      min: { type: Number },
      max: { type: Number },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

courseSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("courses", courseSchema);

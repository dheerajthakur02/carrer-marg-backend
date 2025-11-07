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
      type: String, // e.g., "4 Years", "2 Years", "6 Months"
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

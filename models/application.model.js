import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `application-${uuidv4()}`,
    },
    studentId: {
      type: String,
      required: true,
    },
    collegeId: {
      type: String,
      required: true,
    },
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

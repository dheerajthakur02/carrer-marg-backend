// models/agent.model.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const agentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `agent-${uuidv4()}`,
    },
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    assignedStudents: [
      {
        studentId: String,
        assignedOn: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    totalStudentsHandled: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

agentSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("Agent", agentSchema);

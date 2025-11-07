import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `user-${uuidv4()}`,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "college", "super-admin"],
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});
export default mongoose.model("users", userSchema);

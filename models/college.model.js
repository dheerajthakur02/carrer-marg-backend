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
    email: {
      type: String,
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
    establishedYear: {
      type: Number,
    },
    type: {
      type: String,
      enum: ["private", "government", "deemed", "autonomous"],
    },
    affiliation: {
      type: String,
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
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
    pincode: {
      type: String,
    },

    courses: [],

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

    facilities: [
      {
        type: String,
      },
    ],

    admissionProcess: {
      type: String,
    },
    applicationLink: {
      type: String,
    },
    brochure: {
      type: String,
    },

    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

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

    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },

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

collegeSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("college", collegeSchema);

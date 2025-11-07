import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";

//import routes
import authRoutes from "./routes/auth.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import courseRoutes from "./routes/course.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import agentRoutes from "./routes/agent.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/agent", agentRoutes);

app.get("/", (req, res) => {
  res.send("Sever is running");
});
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});

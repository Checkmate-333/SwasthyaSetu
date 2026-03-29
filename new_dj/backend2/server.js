require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes imports
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const visitRoutes = require("./routes/visitRoutes");
const reportRoutes = require("./routes/reportRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON parsing
app.use(express.urlencoded({ extended: true }));

// Routes setup
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/ai-summary", aiRoutes);

// Expose the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Base route logic (Fallback, good for healthcheck)
app.get("/", (req, res) => {
  res.send("API is running.");
});

// Error Handling middleware could be added here

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

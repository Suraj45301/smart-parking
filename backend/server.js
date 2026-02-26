const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const slotRoutes = require("./routes/slotRoutes");

const app = express();

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "https://smart-parking-ruby.vercel.app"] }));
app.use(express.json());

// Routes
app.use("/api/slots", slotRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Smart Parking API is running 🚗" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smart-parking";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

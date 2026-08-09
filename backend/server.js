const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const donorRoutes = require("./routes/donorRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// ROUTES
// =====================================================

app.use(
  "/api/donors",
  donorRoutes
);

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "Blood Bank Management System Backend is Running! 🩸",
    developer: "Ankit Lodhi",
  });

});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message:
      "API route not found.",
  });

});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "SERVER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });

  }
);

// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );

    console.log(
      "🩸 Blood Bank Management System"
    );

  }
);
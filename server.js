const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      try {
        const host = new URL(origin).hostname;
        if (host.endsWith("netlify.app")) return callback(null, true);
      } catch (e) {}

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// DB + seed
const connectDB = require("./config/connectDB");
const seedRoles = require("./config/seed/seedRoles");
const seedAdmin = require("./config/seed/seedAdmin");

connectDB().then(async () => {
  try {
    await seedRoles();
    await seedAdmin();
  } catch (error) {
    console.log("Erreur while seeding", error.message);
  }
});

// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/role", require("./routes/role.route"));



// Health endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    origin: req.headers.origin || null,
    host: req.headers.host || null,
  });
});

// Fallback
app.use((req, res) => {
  res.json("api is running!!!");
});

const PORT = process.env.PORT || 4700;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server is running on http://localhost:${PORT}`);
});

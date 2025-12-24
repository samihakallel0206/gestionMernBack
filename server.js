const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route de fallback pour l'avatar par défaut
app.get("/uploads/avatar.png", (req, res) => {
  const avatarPath = path.join(__dirname, "uploads", "avatar.png");
  res.sendFile(avatarPath, (err) => {
    if (err) {
      res.status(404).json({ error: "Avatar not found" });
    }
  });
});

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

// Route pour servir les images avec gestion d'erreur améliorée
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "uploads", filename);

  // Vérifier si le fichier existe
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    // Si le fichier demandé n'existe pas, servir l'avatar par défaut
    const defaultAvatar = path.join(__dirname, "uploads", "avatar.png");
    if (fs.existsSync(defaultAvatar)) {
      res.sendFile(defaultAvatar);
    } else {
      // Si même l'avatar par défaut n'existe pas, rediriger vers une image placeholder
      res.redirect("https://via.placeholder.com/150x150/gray/white?text=User");
    }
  }
});

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

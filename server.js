const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const app = express();
//middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://coruscating-mermaid-dca2df.netlify.app/",
    ],
    credentials: true,
  })
);

//connexion to DB
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

//pour le déploiment 
app.use((req, res) => {
  res.json("api is running!!!")
})

// ---------------------------------Fin de page----------------------------------
const PORT = process.env.PORT || 4700;
app.listen(PORT, (err) => {
  err
    ? console.log(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});

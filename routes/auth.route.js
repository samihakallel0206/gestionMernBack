const express = require("express");
//!
const {
  register,
  login,
  logout,
  current,
} = require("../controllers/auth.controller");
const upload = require("../utils/multer");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validations/authValidations");
const validate = require("../middlewares/validations/validator");
const isAuth = require("../middlewares/isAuth");
const hashRole = require("../middlewares/hashRole");
const router = express.Router();
//TEST
router.get("/test", (req, res) => {
  res.end("Bonjour");
});
// REGISTER
router.post(
  "/register",
  isAuth,
  hashRole("ADMIN"),
  upload.single("profilePic"),
  registerValidation,
  validate,
  register
);
//LOGIN
router.post("/login", loginValidation, validate, login);
//LOGOUT
router.post("/logout", isAuth, logout); //pour plus de sécurité
//CURRENT
router.get("/current", isAuth, current);

module.exports = router;

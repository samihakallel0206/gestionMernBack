const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const removeUploadImg = require("../utils/removeUploadImg");
const fs = require("fs");
const path = require("path");

// -----------------------REGISTER---------------
exports.register = async (req, res) => {
  try {
    const { userName, email, password, phone, roleTitre } = req.body;
    //!image
    let profilePic = "/uploads/avatar.png";    
    if (req.file) {
      profilePic = `/uploads/${req.file.filename}`;
    }
    //check email exist
    const existUser = await User.findOne({ email });
    if (existUser) {
      //!1
      removeUploadImg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Email already exists" }],
      });
    }
    //role exist +normalisation
    if (!roleTitre || typeof roleTitre !== "string") {
      //!2
      removeUploadImg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Role required!!" }],
      });
    }

    const normRoleTitre = roleTitre.trim().toUpperCase();
    const existRole = await Role.findOne({ titre: normRoleTitre });
    if (!existRole) {
      //!3
      removeUploadImg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Role Invalid" }],
      });
    }
    // console.log(existRole)
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //creation user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phone,
      // rajouter l'image
      profilePic,
      role: existRole._id,
    });
    //save
    await newUser.save();
    //response success
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    //!4
    removeUploadImg(req.file);
    res.status(500).json({
      success: false,
      errors: [{ message: "Fail to create user!!" }],
    });
  }
};

//-----------------LOGIN-----------------------

exports.login = async (req, res) => {
  try {
    //check du email?
    console.log(req.body);
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }).populate("role");
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Bad Credentials 1" }],
      });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Bad Credentials 2" }],
      });
    }
    // Génération du token JWT
    const token = jwt.sign(
      { id: foundUser._id, role: foundUser.role.titre },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000, // 2h
    });
    //response
    res.status(200).json({
      success: true,
      message: "Login successfully!",
      user: foundUser,
    });
  } catch (error) {
    // error
    res.status(500).json({
      success: false,
      errors: [{ message: "Fail to connect user!!" }],
    });
  }
};

// ---------------LOGOUT-----------------------
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      message: ["Logout Successfully"],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: [{ message: "Error during the logout" }],
    });
  }
};

// ---------------------CURRENT------------------

exports.current = async (req, res) => {
  try {
    //  req.user?
    const foundUser = await User.findById(req.user.id).populate("role");
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errors: [{ message: "User not found" }],
      });
    }
    return res.status(200).json({
      success: true,
      user: foundUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [{ message: "Server error" }],
    });
  }
};

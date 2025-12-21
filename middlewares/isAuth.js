const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuth = async (req, res, next) => {
  try {
    //verification de config (option)
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        errors: [{ message: "JWT_SECRET missed" }],
      });
      }
      //recupérer le token
      const token = req.cookies.token;
      if (!token) {
          return res.status(401).json({
            success: false,
            errors: [{ message: "Not TOKEN  provided" }],
          });
      }
      //decode
      let decoded = jwt.verify(token, process.env.JWT_SECRET)
      //est ceque le user existe dans ma collection
      const foundUser = await User.findById(decoded.id).populate("role")
      if (!foundUser) {
           return res.status(404).json({
             success: false,
             errors: [{ message: "User not exist" }],
           });
      }
      req.user = {
          id: foundUser._id,
          role: foundUser.role.titre
      }
      next()
  } catch (error) {
      res.status(500).json({
        success: false,
        errors: [{ message: "Server Error" }],
      });
  }
};

module.exports= isAuth
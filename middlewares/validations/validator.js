const { validationResult } = require("express-validator");
const removeUploadImg = require("../../utils/removeUploadImg");

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    
  if (!errors.isEmpty()) {
    removeUploadImg(req.file)
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

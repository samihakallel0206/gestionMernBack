const fs = require("fs");

const removeUploadImg = (file) => {
  //! erreur
  if (!file || !file.path) return;   // ❌filePath
  fs.unlink(file.path, (err) => {
    if (err && err.code !== "ENOENT") {
      console.log("Failed To remove uploadFile", err.message);
    }
  });
};

module.exports = removeUploadImg
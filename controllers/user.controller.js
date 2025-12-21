const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const listusers = await User.find().populate("role");
    res.status(200).json({ message: "list of users", users: listusers });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      //   .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      //   .select("-password")
      .populate("role");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

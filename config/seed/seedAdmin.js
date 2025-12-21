const bcrypt = require("bcrypt");
const User = require("../../models/User");
const Role = require("../../models/Role");

async function seedAdmin() {
  try {
    const adminRole = await Role.findOne({ titre: "ADMIN" });
    if (!adminRole) {
      console.log("Role ADMIN missing. Run role seeding first.");
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn(
        "ADMIN_EMAIL and ADMIN_PASSWORD env vars required to create the admin. No user created."
      );
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already present, skipping seed.");
      return;
    }

    const adminName = process.env.ADMIN_NAME || "Super Admin";
    const adminPhone = process.env.ADMIN_PHONE;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      userName: adminName,
      email: adminEmail,
      password: hashedPassword,
      phone: adminPhone,
      role: adminRole._id,
    });

    console.log(`Admin user created with email ${adminEmail}.`);
  } catch (error) {
    console.error("Error while seeding admin:", error.message);
  }
}

module.exports = seedAdmin;



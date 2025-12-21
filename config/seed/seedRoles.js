const Role = require("../../models/Role");

async function seedRoles() {
  try {
    const count = await Role.countDocuments();

    if (count > 0) {
      console.log("⭐ Les rôles existent déjà");
      return;
    }

    await Role.insertMany([
      {
        titre: "ADMIN",
        permissions: [],
      },
      {
        titre: "USER",
        permissions: [],
      },
      {
        titre: "AGENT",
        permissions: [],
      },
      {
        titre: "RECRUT",
        permissions: [],
      },
    ]);
    // console.log(count);

    console.log("Role crées par défaut");
  } catch (error) {
    console.log("Erreur lors du seed Role");
  }
}

module.exports = seedRoles;

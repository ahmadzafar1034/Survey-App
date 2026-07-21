// Seed script — creates a default admin user if none exists.
// Default credentials: admin / admin123  (CHANGE IMMEDIATELY after first login)
import { db } from "../src/lib/db";

async function main() {
  const existing = await db.adminUser.count();
  if (existing > 0) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }
  await db.adminUser.create({
    data: {
      username: "admin",
      password: "admin123",
    },
  });
  console.log("✓ Default admin created.");
  console.log("  Username: admin");
  console.log("  Password: admin123");
  console.log("  ⚠️  Change this password immediately after first login.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

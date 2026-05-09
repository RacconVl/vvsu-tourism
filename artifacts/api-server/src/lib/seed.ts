import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export async function seedAdminUser(): Promise<void> {
  try {
    const adminEmail = "admin@vvsu.ru";
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail)).limit(1);
    if (existing.length === 0) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await db.insert(usersTable).values({
        email: adminEmail,
        passwordHash,
        name: "Администратор ВВГУ",
        role: "admin",
        studentRole: "admin",
        bio: "Преподаватель Института туризма и креативных индустрий",
        level: 10,
        xp: 5000,
      });
      logger.info({ email: adminEmail }, "Seeded default admin user");
    }
  } catch (e) {
    logger.error({ err: e }, "Failed to seed admin user");
  }
}

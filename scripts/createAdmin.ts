// scripts/createAdmin.ts
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import Admin from "@/backend/lib/models/Admin";
import { hashSync } from "bcryptjs"; // Cambiado a bcryptjs
// import { sendVerificationEmail } from "@/backend/lib/email";
import { randomBytes } from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

async function createFirstAdmin() {
  await dbConnect();

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env");
  }

  try {
    // Elimina admin existente si hay uno
    await Admin.deleteOne({ email: ADMIN_EMAIL });

    // Crea nuevo admin con hash consistente (ahora usando hashSync de bcryptjs)
    const hashedPassword = hashSync(ADMIN_PASSWORD, 10);



   // Crear el usuario en la base de datos
    const admin = await Admin.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      emailVerified: false,
      verificationToken: randomBytes(32).toString("hex"),
    });

    console.log(`
      ✅ Admin creado correctamente:
      Email: ${ADMIN_EMAIL}
      Password: ${ADMIN_PASSWORD}
      Hash: ${hashedPassword}
      `);
  } catch (error) {
    console.error("Error creando administrador:", error);
  } finally {
    process.exit();
  }
}

createFirstAdmin();
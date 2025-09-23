import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/backend/lib/services/emailService";

export async function POST(req: NextRequest) {
 

  try {
    const body = await req.json();
    const { nombre, email, telefono, mensaje } = body;

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { message: "Nombre, email y mensaje son requeridos" },
        { status: 400 }
      );
    }

    // Enviar email
    await sendEmail({
      to: process.env.EMAIL_USER || "kriquelme10@gmail.com",
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || "No proporcionado"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return NextResponse.json(
      { message: "Mensaje enviado con éxito" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en el endpoint de contacto:", error);
    return NextResponse.json(
      { message: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}

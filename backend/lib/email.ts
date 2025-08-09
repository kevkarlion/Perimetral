// backend/lib/email.ts
import nodemailer from 'nodemailer';


const url = process.env.URL_FRONTEND || '';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // O usa SMTP directo
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${url}/api/admin/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: '"Tu App Admin" <no-reply@tudominio.com>',
    to: email,
    subject: 'Verifica tu cuenta de administrador',
    html: `
      <h2>Verificación de cuenta</h2>
      <p>Por favor haz clic en el siguiente enlace para verificar tu email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>Este enlace expirará en 24 horas.</p>
    `,
  });
}
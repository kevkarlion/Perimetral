import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import Admin from '@/backend/lib/models/Admin';
import { dbConnect } from '@/backend/lib/dbConnect/dbConnect';
import { compare } from 'bcryptjs';

interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  }
  return secret;
}

const COOKIE_NAME = 'admin-token';
const MAX_AGE = 86400; // 1 día en segundos

export async function loginAdmin(email: string, password: string) {
  await dbConnect();

  console.log('Intentando iniciar sesión con:', email);

  // Busca al administrador por email (incluyendo la contraseña)
  const admin = await Admin.findOne({ email }).select('+password');
  
  // Debug
  console.log('Admin encontrado:', admin ? admin.email : 'No existe');
  if (admin) {
    console.log('Hash almacenado:', admin.password.substring(0, 15) + '...');
    console.log('Tipo de hash:', admin.password.substring(0, 6));
  }

  if (!admin) throw new Error('Credenciales inválidas');

  // Compara la contraseña ingresada con la almacenada
  const isMatch = await compare(password, admin.password);
  console.log('Resultado de comparación:', isMatch);
  
  if (!isMatch) throw new Error('Credenciales inválidas');

  // Crea JWT
  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email },
    getJwtSecret(),
    { expiresIn: MAX_AGE }
  );

  // Configura la cookie segura
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });

  return { 
    cookie,
    admin: {
      id: admin._id,
      email: admin.email
    }
  };
}

export function createLogoutCookie() {
  return serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });
}

export async function getCurrentAdmin(cookies: any = {}) {
  // Verificación segura del objeto cookies
  if (!cookies || typeof cookies !== 'object') {
    console.error('Invalid cookies object:', cookies);
    return null;
  }

  // Debug: Verifica las cookies recibidas
  console.log('Received cookies:', cookies);
  
  const token = cookies[COOKIE_NAME];
  console.log('Extracted token:', token ? '***' : 'null');
  
  if (!token) {
    console.log('No token found in cookies');
    return null;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
    await dbConnect();
    return await Admin.findById(decoded.id).select('-password');
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
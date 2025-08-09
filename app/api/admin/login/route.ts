import { NextResponse } from 'next/server';
import { loginAdmin } from '@/backend/lib/auth/auth';
import { dbConnect } from '@/backend/lib/dbConnect/dbConnect';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Establece la cookie de autenticación
    const { cookie, admin } = await loginAdmin(email, password);

    const response = NextResponse.json(
      { success: true, admin },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', cookie);
    return response;

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      },
      { status: 401 }
    );
  }
}
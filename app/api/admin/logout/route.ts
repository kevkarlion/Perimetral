// app/api/admin/logout/route.ts
import { createLogoutCookie } from '@/backend/lib/auth/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookie = createLogoutCookie();
    
    const response = NextResponse.json(
      { success: true, message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );
    
    // Establece la cookie de logout
    response.headers.set('Set-Cookie', cookie);
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
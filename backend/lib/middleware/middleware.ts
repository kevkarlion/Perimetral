// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('admin-token')?.value;

  // Rutas protegidas
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verificar el token JWT
      const { verify } = await import('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET;
      
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET no configurado');
      }

      verify(token, JWT_SECRET);
    } catch (error) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
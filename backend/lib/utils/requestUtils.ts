// backend/lib/utils/requestUtils.ts
import { NextRequest } from 'next/server';

export function getCookiesFromRequest(req: NextRequest): Record<string, string> {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies: Record<string, string> = {};
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  
  return cookies;
}
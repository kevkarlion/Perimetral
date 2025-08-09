// app/admin/_components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Forzar recarga completa para limpiar el estado del servidor
        window.location.href = '/login';
      } else {
        alert('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  );
}
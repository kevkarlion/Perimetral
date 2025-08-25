'use client';

import { Suspense } from 'react';
import PagoPendienteEfectivoComponent from '@/app/components/PagoEfectivo';

export default function PagoPendienteEfectivoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <PagoPendienteEfectivoComponent />
    </Suspense>
  );
}

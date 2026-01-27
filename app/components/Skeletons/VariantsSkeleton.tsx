'use client'

export default function VariantsSkeleton() {
  const skeletonItems = Array.from({ length: 6 })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {skeletonItems.map((_, idx) => (
        <div
          key={idx}
          // ESTILOS DIRECTOS - sin Tailwind para dimensiones
          style={{
            width: '100%',
            minWidth: '300px',
            height: '420px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            position: 'relative',
          }}
          className="animate-pulse"
        >
          {/* IMAGEN - 50% de la card */}
          <div
            style={{
              width: '100%',
              height: '208px',
              backgroundColor: '#e5e7eb',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '32px',
                height: '20px',
                backgroundColor: '#d1d5db',
                borderRadius: '4px',
              }}
            ></div>
          </div>

          {/* CONTENIDO - 50% de la card */}
          <div
            style={{
              padding: '20px',
              height: '212px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Título */}
            <div
              style={{
                height: '24px',
                backgroundColor: '#d1d5db',
                borderRadius: '4px',
                width: '75%',
                marginBottom: '16px',
              }}
            ></div>
            
            {/* Descripción */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  height: '16px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  width: '100%',
                  marginBottom: '8px',
                }}
              ></div>
              <div
                style={{
                  height: '16px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  width: '85%',
                }}
              ></div>
            </div>
            
            {/* Precio */}
            <div
              style={{
                height: '32px',
                backgroundColor: '#d1d5db',
                borderRadius: '4px',
                width: '35%',
                marginBottom: '16px',
              }}
            ></div>
            
            {/* Medida y Stock */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div
                style={{
                  height: '12px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  width: '45%',
                }}
              ></div>
              <div
                style={{
                  height: '16px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  width: '25%',
                }}
              ></div>
            </div>
            
            {/* Botón */}
            <div
              style={{
                height: '40px',
                backgroundColor: '#d1d5db',
                borderRadius: '9999px',
                width: '100%',
                marginTop: 'auto',
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
import { NextResponse } from 'next/server';

/**
 * Registra errores de forma estructurada con diferentes niveles de severidad
 * @param context Contexto donde ocurrió el error (ej: "POST /api/orders")
 * @param error Objeto de error o mensaje
 * @param metadata Información adicional relevante
 */
export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, any>
) {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    context,
    environment: process.env.NODE_ENV || 'development',
    
    // Extraer información del error
    ...(error instanceof Error ? {
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
      name: error.name
    } : {
      message: String(error)
    }),
    
    // Metadata adicional
    ...metadata,
    
    // Información del sistema
    nodeVersion: process.version,
    ...(process.env.VERCEL && {
      deployment: {
        region: process.env.VERCEL_REGION,
        environment: process.env.VERCEL_ENV
      }
    })
  };

  // Console.error en desarrollo, console.log en producción para evitar saturación

  // Aquí puedes agregar integración con servicios externos como:
  // - Sentry/Rollbar para monitoreo
  // - Slack/Teams para notificaciones
  // - Base de datos para historial de errores
}

/**
 * Clase personalizada para errores de API
 */
export class ApiError extends Error {
  statusCode: number;
  details?: any;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    options: {
      details?: any;
      isOperational?: boolean;
    } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
    
    // Mantiene el stack trace en V8 (Node.js, Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Manejador de errores para respuestas HTTP
 */
export function handleApiError(error: unknown): NextResponse {
  // Error conocido de nuestra API
  if (error instanceof ApiError) {
    logError('API Error', error, { 
      statusCode: error.statusCode,
      isOperational: error.isOperational
    });
    
    return NextResponse.json(
      {
        error: error.message,
        ...(error.details && { details: error.details })
      },
      { status: error.statusCode }
    );
  }
  
  // Error de validación (ej: ZodError)
  if ((error as any).name === 'ZodError') {
    const details = (error as any).errors.map((err: any) => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    logError('Validation Error', error, { details });
    
    return NextResponse.json(
      {
        error: 'Datos de entrada inválidos',
        details
      },
      { status: 400 }
    );
  }
  
  // Error de Mongoose
  if ((error as any).name?.includes('Mongo') || (error as any).codeName) {
    const mongoError = {
      name: (error as any).name,
      code: (error as any).code,
      codeName: (error as any).codeName,
      errorLabels: (error as any).errorLabels
    };
    
    logError('Database Error', error, mongoError);
    
    return NextResponse.json(
      {
        error: 'Error en la base de datos',
        ...(process.env.NODE_ENV === 'development' && {
          details: mongoError
        })
      },
      { status: 500 }
    );
  }
  
  // Error genérico
  logError('Unhandled Error', error);
  
  return NextResponse.json(
    {
      error: 'Error interno del servidor',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : String(error)
      })
    },
    { status: 500 }
  );
}

/**
 * Middleware para envolver handlers de API con manejo de errores
 */
export function withErrorHandler(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
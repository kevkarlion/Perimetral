import mongoose, { Mongoose } from 'mongoose';

// Usar función para acceder a la variable de entorno
function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }
  return uri;
}

// Extiende la interfaz global para el caché de Mongoose
declare global {
  var mongooseGlobal: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

// Inicializa el caché global si no existe
let cached = global.mongooseGlobal;

if (!cached) {
  cached = global.mongooseGlobal = { conn: null, promise: null };
}

export async function dbConnect(): Promise<Mongoose> {
  // 1. Retornar conexión existente si está disponible
  if (cached.conn) {
  
    return cached.conn;
  }

  // 2. Crear nueva conexión si no hay una pendiente
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    };

   
    cached.promise = mongoose
      .connect(getMongoUri(), opts)
      .then((mongoose) => {
     
        return mongoose;
      })
      .catch((err) => {
     
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

// Manejo de desconexión para desarrollo (opcional)
if (process.env.NODE_ENV === 'development') {
  process.on('beforeExit', async () => {
    if (cached.conn) {
      await cached.conn.disconnect();
    
    }
  });
}

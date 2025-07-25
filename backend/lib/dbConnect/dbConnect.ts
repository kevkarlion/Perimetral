import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
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
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  // 2. Crear nueva conexión si no hay una pendiente
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 segundos para selección de servidor
      socketTimeoutMS: 45000, // Cierra sockets después de 45s de inactividad
      family: 4, // Usar IPv4, omitir IPv6
    };

    console.log('🔄 Creating new MongoDB connection');
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('✨ MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        cached.promise = null; // Resetear en caso de error
        throw err;
      });
  }

  // 3. Esperar la conexión y cachearla
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
      console.log('🛑 MongoDB disconnected');
    }
  });
}
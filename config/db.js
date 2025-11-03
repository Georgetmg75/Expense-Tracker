// src/db/connectDB.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI missing!');
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) {
    console.log('✅ REUSING CACHED DB');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🚀 CONNECTING TO MONGODB...');
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      family: 4,
      retryWrites: true,
      w: 'majority'
      // REMOVED: keepAlive & keepAliveInitialDelay → NOT SUPPORTED HERE
    }).then((client) => {
      // APPLY KEEPALIVE MANUALLY
      client.connection.getClient().options = {
        ...client.connection.getClient().options,
        keepAlive: true,
        keepAliveInitialDelay: 300000
      };
      return client;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('🎉 DB CONNECTED & KEEPALIVE ON');

    // PING EVERY 30 SEC
    setInterval(() => {
      mongoose.connection.db?.admin().ping((err) => {
        if (err) console.error('💀 PING FAIL:', err);
        else console.log('❤️ DB ALIVE');
      });
    }, 30000);

    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('💀 DB FAILED:', err);
    throw err;
  }
};

// EVENTS
mongoose.connection.on('connected', () => console.log('✅ DB CONNECTED'));
mongoose.connection.on('error', (err) => console.error('❌ DB ERROR:', err));
mongoose.connection.on('disconnected', () => console.log('⚠️ DB DISCONNECTED'));

export default connectDB;
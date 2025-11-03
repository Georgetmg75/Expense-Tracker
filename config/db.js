// src/db/connectDB.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI missing! Check .env');
}

// GLOBAL CACHE
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('✅ REUSING CACHED DB CONNECTION');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🚀 CONNECTING TO MONGODB...');
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,           // NO BUFFER = NO TIMEOUT HELL
      serverSelectionTimeoutMS: 30000, // 30 SEC
      socketTimeoutMS: 60000,          // 60 SEC
      connectTimeoutMS: 30000,
      maxPoolSize: 10,                 // MORE POOL
      minPoolSize: 5,
      family: 4,                       // IPv4
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      autoIndex: true,
      retryWrites: true,
      w: 'majority'
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('🎉 MONGODB CONNECTED & LOCKED IN');

    // KEEP ALIVE PING
    setInterval(() => {
      mongoose.connection.db?.admin().ping((err, result) => {
        if (err) console.error('💀 DB PING FAILED:', err);
        else console.log('❤️ DB PING ALIVE');
      });
    }, 30000); // EVERY 30 SEC

    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('💀 DB CONNECTION FAILED:', err);
    throw err;
  }
};

// EVENT LISTENERS
mongoose.connection.on('connected', () => console.log('✅ DB CONNECTED'));
mongoose.connection.on('disconnected', () => console.log('⚠️ DB DISCONNECTED'));
mongoose.connection.on('error', (err) => console.error('❌ DB ERROR:', err));

// GRACEFUL SHUTDOWN
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 DB CLOSED - BYE!');
  process.exit(0);
});

export default connectDB;









// import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error('❌ MONGO_URI is missing from environment variables');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connectDB = async () => {
//   if (cached.conn) {
//     console.log('✅ Using cached MongoDB connection');
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     console.log('🔌 Connecting to MongoDB...');
//     cached.promise = mongoose.connect(MONGO_URI, {
//       bufferCommands: false,
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 45000,
//       family: 4,
//       maxPoolSize: 5,
//     });
//   }

//   cached.conn = await cached.promise;

//   mongoose.connection.on('connected', () => {
//     console.log('✅ MongoDB connected via event');
//   });

//   mongoose.connection.on('error', (err) => {
//     console.error('❌ MongoDB connection error via event:', err);
//   });

//   return cached.conn;
// };

// export default connectDB;
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodInstance = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('⚡ No MONGO_URI specified. Initializing embedded MongoMemoryServer for instant zero-config testing...');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'feedants_competitions'
        }
      });
      mongoUri = mongodInstance.getUri();
      console.log(`✅ Embedded MongoDB ready at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If external URI failed, try fallback to memory server
    if (process.env.MONGO_URI && !mongodInstance) {
      console.log('🔄 Falling back to embedded MongoMemoryServer...');
      mongodInstance = await MongoMemoryServer.create();
      const fallbackUri = mongodInstance.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`✅ Fallback MongoDB ready at: ${fallbackUri}`);
      return conn;
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };

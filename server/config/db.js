const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdsense');
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      retries += 1;
      console.log(`Retrying connection (${retries}/${MAX_RETRIES}) in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  if (process.env.NODE_ENV === 'production') {
    console.error("Failed to connect to MongoDB after maximum retries. Exiting process.");
    process.exit(1);
  } else {
    console.warn("⚠️  Failed to connect to MongoDB after maximum retries. Server will continue without DB (dev mode).");
  }
};

module.exports = connectDB;

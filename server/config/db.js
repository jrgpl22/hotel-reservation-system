import mongoose from 'mongoose';

let connectionPromise = null;

// Safe to call on every request: it connects once and reuses the connection,
// which is what serverless hosting needs.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then((instance) => {
        console.log(`MongoDB connected: ${instance.connection.host}`);
        return instance.connection;
      })
      .catch((error) => {
        connectionPromise = null; // let the next request try again
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
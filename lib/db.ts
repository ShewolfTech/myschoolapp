import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development, and across serverless function invocations in production.
 * Without this, every API route/file that imports this module would open
 * a brand new connection.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  // Read the env var here (call-time), not at module-load-time. Standalone
  // scripts (run via tsx) load .env.local themselves via dotenv, which only
  // takes effect after this module has already been imported — ESM hoists
  // all `import` statements above other code, so a module-level env check
  // here would run before dotenv's config() call ever executes.
  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
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

export default connectDB;

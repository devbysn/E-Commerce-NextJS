import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongo;
if (!cached) cached = global.mongo = {};

export async function connectToDatabase() {
  try {
    if (cached.conn) return cached.conn;
    if (!MONGODB_URI)
      throw new Error("Please define the MONGODB_URI environment variable");

    const opts = {
      useNewUrlParser: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(),
      };
    });
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}

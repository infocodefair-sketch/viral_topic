import { MongoClient, type Db } from "mongodb";

const databaseName = "viral_topic";

let clientPromise: Promise<MongoClient> | null = null;

function getClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(databaseName);
}


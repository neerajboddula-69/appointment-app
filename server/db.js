import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB || "appointment_booking";

let client;
let database;

export async function connectToDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(mongoUri);
  await client.connect();
  database = client.db(dbName);
  return database;
}

export async function getCollections() {
  const db = await connectToDatabase();

  return {
    db,
    admins: db.collection("admins"),
    customers: db.collection("customers"),
    providers: db.collection("providers"),
    services: db.collection("services"),
    unavailability: db.collection("unavailability"),
    appointments: db.collection("appointments"),
    waitlist: db.collection("waitlist"),
    notifications: db.collection("notifications"),
    chatMessages: db.collection("chatMessages")
  };
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

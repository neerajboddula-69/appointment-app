import { closeDatabase, getCollections } from "../db.js";
import { admins, appointments, chatMessages, customers, notifications, providers, services, unavailability, waitlist } from "../data/seedData.js";

async function run() {
  const collections = await getCollections();

  await Promise.all([
    collections.admins.deleteMany({}),
    collections.customers.deleteMany({}),
    collections.providers.deleteMany({}),
    collections.services.deleteMany({}),
    collections.unavailability.deleteMany({}),
    collections.appointments.deleteMany({}),
    collections.waitlist.deleteMany({}),
    collections.notifications.deleteMany({}),
    collections.chatMessages.deleteMany({})
  ]);

  await Promise.all([
    collections.admins.insertMany(admins),
    collections.customers.insertMany(customers),
    collections.providers.insertMany(providers),
    collections.services.insertMany(services),
    collections.unavailability.insertMany(unavailability),
    collections.appointments.insertMany(appointments),
    collections.waitlist.insertMany(waitlist),
    collections.notifications.insertMany(notifications),
    collections.chatMessages.insertMany(chatMessages)
  ]);

  await collections.customers.createIndex({ email: 1 }, { unique: true });
  await collections.admins.createIndex({ email: 1 }, { unique: true });
  await collections.appointments.createIndex({ providerId: 1, date: 1, startTime: 1 });
  await collections.chatMessages.createIndex({ participantRole: 1, participantId: 1, providerId: 1, createdAt: 1 });

  console.log("MongoDB seed data applied successfully.");
}

run()
  .catch((error) => {
    console.error("Database initialization failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabase();
  });

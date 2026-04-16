import { getCollections } from "../db.js";

export async function loadState() {
  const collections = await getCollections();
  const [admins, customers, providers, services, unavailability, appointments, waitlist, notifications, chatMessages] = await Promise.all([
    collections.admins.find({}, { projection: { _id: 0 } }).toArray(),
    collections.customers.find({}, { projection: { _id: 0 } }).toArray(),
    collections.providers.find({}, { projection: { _id: 0 } }).toArray(),
    collections.services.find({}, { projection: { _id: 0 } }).toArray(),
    collections.unavailability.find({}, { projection: { _id: 0 } }).toArray(),
    collections.appointments.find({}, { projection: { _id: 0 } }).toArray(),
    collections.waitlist.find({}, { projection: { _id: 0 } }).toArray(),
    collections.notifications.find({}, { projection: { _id: 0 } }).toArray(),
    collections.chatMessages.find({}, { projection: { _id: 0 } }).toArray()
  ]);

  return {
    admins,
    customers,
    providers,
    services,
    unavailability,
    appointments,
    waitlist,
    notifications,
    chatMessages,
    maps: {
      admins: new Map(admins.map((item) => [item.id, item])),
      customers: new Map(customers.map((item) => [item.id, item])),
      providers: new Map(providers.map((item) => [item.id, item])),
      services: new Map(services.map((item) => [item.id, item]))
    }
  };
}

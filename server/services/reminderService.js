import { getCollections } from "../db.js";
import { createId } from "./bookingService.js";
import { sendEmailNotification } from "./notificationService.js";
import { loadState } from "./stateService.js";

const reminderTimers = new Map();

function getReminderLeadMinutes() {
  return Number(process.env.REMINDER_LEAD_MINUTES || 60);
}

function getAppointmentStart(date, startTime) {
  return new Date(`${date}T${startTime}:00+05:30`);
}

function getReminderMessage({ service, provider, appointment }) {
  return `Reminder: your ${service.name} appointment with ${provider.name} is scheduled for ${appointment.date} at ${appointment.startTime}. Please be ready a few minutes early.`;
}

export function clearAppointmentReminder(appointmentId) {
  const timer = reminderTimers.get(appointmentId);
  if (timer) {
    clearTimeout(timer);
    reminderTimers.delete(appointmentId);
  }
}

async function markReminderSent(appointmentId) {
  const collections = await getCollections();
  await collections.appointments.updateOne(
    { id: appointmentId },
    {
      $set: {
        reminderSentAt: new Date().toISOString()
      }
    }
  );
}

async function createReminderNotification(customer, message) {
  const collections = await getCollections();
  await collections.notifications.insertOne({
    id: createId("notif"),
    customerId: customer.id,
    channel: "email",
    destination: customer.email,
    message,
    createdAt: new Date().toISOString()
  });
}

async function sendReminder({ appointment, customer, service, provider }) {
  if (!customer?.email || appointment.reminderSentAt) {
    return;
  }

  const message = getReminderMessage({ service, provider, appointment });

  const delivered = await sendEmailNotification(customer, {
    subject: `${service.name} appointment reminder`,
    emailMessage: message
  });

  if (delivered) {
    await createReminderNotification(customer, message);
    await markReminderSent(appointment.id);
  }
}

export function scheduleAppointmentReminder(context) {
  const { appointment, customer, service, provider } = context;
  clearAppointmentReminder(appointment.id);

  if (!appointment || appointment.status !== "confirmed" || appointment.reminderSentAt) {
    return;
  }

  const appointmentStart = getAppointmentStart(appointment.date, appointment.startTime);
  const reminderAt = new Date(appointmentStart.getTime() - getReminderLeadMinutes() * 60 * 1000);
  const now = new Date();

  if (appointmentStart <= now) {
    return;
  }

  if (reminderAt <= now) {
    void sendReminder(context);
    return;
  }

  const timer = setTimeout(() => {
    reminderTimers.delete(appointment.id);
    void sendReminder(context);
  }, reminderAt.getTime() - now.getTime());

  reminderTimers.set(appointment.id, timer);
}

export async function initializeAppointmentReminders() {
  const state = await loadState();

  state.appointments
    .filter((appointment) => appointment.status === "confirmed" && !appointment.reminderSentAt)
    .forEach((appointment) => {
      const customer = state.maps.customers.get(appointment.customerId);
      const service = state.maps.services.get(appointment.serviceId);
      const provider = state.maps.providers.get(appointment.providerId);

      scheduleAppointmentReminder({
        appointment,
        customer,
        service,
        provider
      });
    });
}

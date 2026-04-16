import { getCollections } from "../db.js";
import { addMinutes, buildDashboard, canBookSlot, createId, generateSlots, getAppointmentDetails, rankRecommendations } from "../services/bookingService.js";
import { sendBookingNotifications } from "../services/notificationService.js";
import { clearAppointmentReminder, scheduleAppointmentReminder } from "../services/reminderService.js";
import { loadState } from "../services/stateService.js";

async function createNotificationRecord(customer, channel, destination, message) {
  const collections = await getCollections();
  const notification = {
    id: createId("notif"),
    customerId: customer.id,
    channel,
    destination,
    message,
    createdAt: new Date().toISOString()
  };

  await collections.notifications.insertOne(notification);
  return notification;
}

async function saveAppointmentAndNotifications(state, appointment) {
  const collections = await getCollections();
  await collections.appointments.insertOne(appointment);

  const customer = state.maps.customers.get(appointment.customerId);
  const service = state.maps.services.get(appointment.serviceId);
  const notifications = [];

  const mailMessage = `Your ${service.name} booking request for ${appointment.date} at ${appointment.startTime} has been received and is waiting for admin approval.`;

  if (customer?.email) {
    notifications.push(await createNotificationRecord(customer, "email", customer.email, mailMessage));
  }

  appointment.notifications = notifications.map((item) => item.id);
  await collections.appointments.updateOne({ id: appointment.id }, { $set: { notifications: appointment.notifications } });

  await sendBookingNotifications(customer, {
    subject: `${service.name} booking request received`,
    emailMessage: mailMessage
  });

  state.appointments.push(appointment);

  return {
    appointment,
    notifications
  };
}

export async function getSchedule(req, res) {
  try {
    const { date, serviceId, providerId } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const state = await loadState();
    return res.json({ date, slots: generateSlots(state, { date, serviceId, providerId }) });
  } catch {
    return res.status(500).json({ message: "Unable to load schedule." });
  }
}

export async function getRecommendations(req, res) {
  try {
    const { customerId, date, serviceId } = req.query;
    if (!customerId || !date || !serviceId) {
      return res.status(400).json({ message: "customerId, date and serviceId are required." });
    }

    const state = await loadState();
    return res.json(rankRecommendations(state, { customerId, date, serviceId }));
  } catch {
    return res.status(500).json({ message: "Unable to load recommendations." });
  }
}

export async function getDashboard(req, res) {
  try {
    const { role, userId } = req.query;
    if (!role || !userId) {
      return res.status(400).json({ message: "role and userId are required." });
    }

    const state = await loadState();
    return res.json(buildDashboard(state, role, userId));
  } catch {
    return res.status(500).json({ message: "Unable to load dashboard." });
  }
}

export async function createAppointment(req, res) {
  try {
    const { customerId, providerId, serviceId, date, startTime, priority = "normal", note = "" } = req.body;
    const state = await loadState();
    const check = canBookSlot(state, { providerId, serviceId, date, startTime, priority });

    if (!check.allowed) {
      return res.status(400).json({ message: check.message });
    }

    const service = state.maps.services.get(serviceId);
    const appointment = {
      id: createId("appt"),
      customerId,
      providerId,
      serviceId,
      date,
      startTime,
      endTime: addMinutes(startTime, service.duration),
      priority,
      status: "pending",
      note,
      createdAt: new Date().toISOString()
    };

    const result = await saveAppointmentAndNotifications(state, appointment);

    return res.status(201).json({
      message:
        priority === "emergency"
          ? "Emergency booking request submitted. The customer will be notified after admin review by email."
          : "Booking request submitted successfully. Approval updates will be sent by email.",
      appointment: getAppointmentDetails(result.appointment, state)
    });
  } catch {
    return res.status(500).json({ message: "Unable to create booking request." });
  }
}

export async function approveAppointment(req, res) {
  try {
    const { adminId } = req.body;
    const state = await loadState();
    const appointment = state.appointments.find((item) => item.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    if (!state.maps.admins.get(adminId)) {
      return res.status(403).json({ message: "Admin authorization required." });
    }

    const collections = await getCollections();
    await collections.appointments.updateOne({ id: appointment.id }, { $set: { status: "confirmed", approvedBy: adminId } });
    appointment.status = "confirmed";
    appointment.approvedBy = adminId;

    const customer = state.maps.customers.get(appointment.customerId);
    const service = state.maps.services.get(appointment.serviceId);
    const message = `Your ${service.name} appointment on ${appointment.date} at ${appointment.startTime} is confirmed.`;

    if (customer?.email) {
      await createNotificationRecord(customer, "email", customer.email, message);
    }

    await sendBookingNotifications(customer, {
      subject: `${service.name} booking confirmed`,
      emailMessage: message
    });

    scheduleAppointmentReminder({
      appointment,
      customer,
      service,
      provider: state.maps.providers.get(appointment.providerId)
    });

    return res.json({
      message: "Booking approved successfully.",
      appointment: getAppointmentDetails(appointment, state)
    });
  } catch {
    return res.status(500).json({ message: "Unable to approve booking." });
  }
}

export async function cancelAppointment(req, res) {
  try {
    const { cancellationReason } = req.body;
    if (!cancellationReason) {
      return res.status(400).json({ message: "Cancellation reason is required." });
    }

    const state = await loadState();
    const appointment = state.appointments.find((item) => item.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const collections = await getCollections();
    await collections.appointments.updateOne({ id: appointment.id }, { $set: { status: "cancelled", cancellationReason } });

    appointment.status = "cancelled";
    appointment.cancellationReason = cancellationReason;
    clearAppointmentReminder(appointment.id);

    const customer = state.maps.customers.get(appointment.customerId);
    const service = state.maps.services.get(appointment.serviceId);
    const message = `Your ${service.name} appointment on ${appointment.date} at ${appointment.startTime} was cancelled: ${cancellationReason}.`;

    if (customer?.email) {
      await createNotificationRecord(customer, "email", customer.email, message);
    }

    await sendBookingNotifications(customer, {
      subject: `${service.name} booking cancelled`,
      emailMessage: message
    });

    const alternativeSlots = rankRecommendations(state, {
      customerId: appointment.customerId,
      date: appointment.date,
      serviceId: appointment.serviceId
    });

    return res.json({
      message: "Appointment cancelled. You can use the recommended slots to reschedule.",
      appointment: getAppointmentDetails(appointment, state),
      alternativeSlots
    });
  } catch {
    return res.status(500).json({ message: "Unable to cancel appointment." });
  }
}

export async function rescheduleAppointment(req, res) {
  try {
    const state = await loadState();
    const appointment = state.appointments.find((item) => item.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const { providerId, date, startTime, priority = appointment.priority } = req.body;
    const nextProviderId = providerId || appointment.providerId;
    const check = canBookSlot(state, {
      providerId: nextProviderId,
      serviceId: appointment.serviceId,
      date,
      startTime,
      priority,
      excludeAppointmentId: appointment.id
    });

    if (!check.allowed) {
      return res.status(400).json({ message: check.message });
    }

    const service = state.maps.services.get(appointment.serviceId);
    appointment.providerId = nextProviderId;
    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = addMinutes(startTime, service.duration);
    appointment.priority = priority;
    appointment.status = "pending";
    appointment.reminderSentAt = undefined;
    clearAppointmentReminder(appointment.id);

    const collections = await getCollections();
    await collections.appointments.updateOne(
      { id: appointment.id },
      {
        $set: {
          providerId: appointment.providerId,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          priority: appointment.priority,
          status: appointment.status
        },
        $unset: {
          approvedBy: "",
          reminderSentAt: ""
        }
      }
    );

    const customer = state.maps.customers.get(appointment.customerId);
    const message = `${service.name} appointment rescheduled to ${appointment.date} at ${appointment.startTime}.`;

    if (customer?.email) {
      await createNotificationRecord(customer, "email", customer.email, message);
    }

    await sendBookingNotifications(customer, {
      subject: `${service.name} booking rescheduled`,
      emailMessage: message
    });

    return res.json({
      message: "Appointment rescheduled and sent for admin approval again.",
      appointment: getAppointmentDetails(appointment, state)
    });
  } catch {
    return res.status(500).json({ message: "Unable to reschedule appointment." });
  }
}

export async function joinWaitlist(req, res) {
  try {
    const { customerId, providerId, serviceId, date, preferredTimes = [], priority = "normal" } = req.body;
    const entry = {
      id: createId("wait"),
      customerId,
      providerId: providerId || null,
      serviceId,
      date,
      preferredTimes,
      priority
    };

    const collections = await getCollections();
    await collections.waitlist.insertOne(entry);

    return res.status(201).json({
      message: "Added to waitlist. We will notify you if a better slot opens.",
      waitlist: entry
    });
  } catch {
    return res.status(500).json({ message: "Unable to add to waitlist." });
  }
}

export async function deleteAppointment(req, res) {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required." });
    }

    const state = await loadState();
    const appointment = state.appointments.find((item) => item.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const appointmentStart = new Date(`${appointment.date}T${appointment.startTime}:00+05:30`);
    const isPast = appointmentStart < new Date();
    const isDeletable = appointment.status === "cancelled" || isPast;

    if (!isDeletable) {
      return res.status(400).json({ message: "Only past or cancelled appointments can be deleted." });
    }

    if (role === "customer" && appointment.customerId !== userId) {
      return res.status(403).json({ message: "You can only delete your own appointments." });
    }

    if (role === "admin" && !state.maps.admins.get(userId)) {
      return res.status(403).json({ message: "Admin authorization required." });
    }

    if (!["customer", "admin"].includes(role)) {
      return res.status(403).json({ message: "Unauthorized delete request." });
    }

    clearAppointmentReminder(appointment.id);

    const collections = await getCollections();
    await collections.appointments.deleteOne({ id: appointment.id });

    return res.json({ message: "Appointment deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Unable to delete appointment." });
  }
}

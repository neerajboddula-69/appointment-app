const slotStepMinutes = 60;

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function toMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function toTime(value) {
  const hours = String(Math.floor(value / 60)).padStart(2, "0");
  const minutes = String(value % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function addMinutes(value, minutes) {
  return toTime(toMinutes(value) + minutes);
}

export function overlaps(startA, endA, startB, endB) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA);
}

export function createPaymentSummary(service, priority = "normal") {
  const priorityFee = priority === "emergency" ? 99 : priority === "priority" ? 49 : 0;
  const total = service.price + service.bookingFee + priorityFee;

  return {
    amount: total,
    servicePrice: service.price,
    bookingFee: service.bookingFee,
    priorityFee,
    currency: "INR",
    gateway: "SecurePay Demo"
  };
}

export function getAppointmentDetails(appointment, state) {
  return {
    ...appointment,
    service: state.maps.services.get(appointment.serviceId),
    provider: state.maps.providers.get(appointment.providerId),
    customer: state.maps.customers.get(appointment.customerId)
  };
}

export function listProviderAppointments(state, providerId, date, excludeAppointmentId = null) {
  return state.appointments.filter(
    (appointment) =>
      appointment.providerId === providerId &&
      appointment.date === date &&
      ["pending", "confirmed"].includes(appointment.status) &&
      appointment.id !== excludeAppointmentId
  );
}

export function buildBusyRanges(state, providerId, date, excludeAppointmentId = null) {
  const provider = state.maps.providers.get(providerId);
  const busy = listProviderAppointments(state, providerId, date, excludeAppointmentId).map((appointment) => {
    const service = state.maps.services.get(appointment.serviceId);
    const buffer = service?.mode === "in-person" ? provider.travelBufferMinutes : 0;
    return {
      from: toTime(Math.max(0, toMinutes(appointment.startTime) - buffer)),
      to: toTime(Math.min(24 * 60, toMinutes(appointment.endTime) + buffer)),
      reason: buffer ? "Travel + service buffer" : appointment.status === "pending" ? "Pending approval" : "Booked"
    };
  });

  const blocked = state.unavailability
    .filter((entry) => entry.providerId === providerId && entry.date === date)
    .map((entry) => ({ from: entry.from, to: entry.to, reason: entry.reason }));

  return [...busy, ...blocked];
}

export function canBookSlot(state, { providerId, serviceId, date, startTime, priority = "normal", excludeAppointmentId = null }) {
  const provider = state.maps.providers.get(providerId);
  const service = state.maps.services.get(serviceId);

  if (!provider || !service) {
    return { allowed: false, message: "Unknown specialist or service." };
  }

  if (!provider.serviceIds.includes(serviceId)) {
    return { allowed: false, message: "Selected specialist does not offer this service." };
  }

  const weekday = new Date(`${date}T00:00:00`).getDay();
  const windows = provider.availability[weekday] || [];
  const slotEnd = addMinutes(startTime, service.duration);

  const insideAvailability = windows.some(([from, to]) => toMinutes(startTime) >= toMinutes(from) && toMinutes(slotEnd) <= toMinutes(to));
  if (!insideAvailability) {
    return { allowed: false, message: "Slot is outside specialist availability." };
  }

  const busyRanges = buildBusyRanges(state, providerId, date, excludeAppointmentId);
  const blocked = busyRanges.find((range) => overlaps(startTime, slotEnd, range.from, range.to));
  if (blocked) {
    return { allowed: false, message: `Slot conflicts with ${blocked.reason.toLowerCase()}.` };
  }

  const emergencyOnly = provider.emergencySlots.includes(startTime);
  if (emergencyOnly && !["priority", "emergency"].includes(priority)) {
    return { allowed: false, message: "This slot is reserved for priority or emergency bookings." };
  }

  return { allowed: true, message: "Slot available." };
}

export function generateSlots(state, { date, serviceId, providerId }) {
  const providerList = providerId
    ? [state.maps.providers.get(providerId)]
    : state.providers.filter((provider) => !serviceId || provider.serviceIds.includes(serviceId));
  const service = serviceId ? state.maps.services.get(serviceId) : null;

  return providerList
    .filter(Boolean)
    .flatMap((provider) => {
      const weekday = new Date(`${date}T00:00:00`).getDay();
      const windows = provider.availability[weekday] || [];
      const busyRanges = buildBusyRanges(state, provider.id, date);

      return windows.flatMap(([from, to]) => {
        const slots = [];
        for (let cursor = toMinutes(from); cursor + slotStepMinutes <= toMinutes(to); cursor += slotStepMinutes) {
          const startTime = toTime(cursor);
          const duration = service?.duration || slotStepMinutes;
          const endTime = addMinutes(startTime, duration);
          const overlappingBusy = busyRanges.find((range) => overlaps(startTime, endTime, range.from, range.to));
          const existingAppointment = listProviderAppointments(state, provider.id, date).find((appointment) =>
            overlaps(startTime, endTime, appointment.startTime, appointment.endTime)
          );
          const emergencyOnly = provider.emergencySlots.includes(startTime);

          let status = "available";
          let label = "Open";

          if (existingAppointment) {
            status = existingAppointment.status === "pending" ? "pending" : "booked";
            label = existingAppointment.status === "pending" ? "Pending approval" : "Booked";
          } else if (overlappingBusy) {
            status = "buffer";
            label = overlappingBusy.reason;
          } else if (emergencyOnly) {
            status = "emergency";
            label = "Emergency / priority";
          }

          slots.push({
            providerId: provider.id,
            providerName: provider.name,
            specialistTitle: provider.title,
            serviceId,
            date,
            startTime,
            endTime,
            status,
            label
          });
        }
        return slots;
      });
    });
}

export function rankRecommendations(state, { customerId, date, serviceId }) {
  const customer = state.maps.customers.get(customerId);
  const candidateSlots = generateSlots(state, { date, serviceId }).filter((slot) => ["available", "emergency"].includes(slot.status));

  return candidateSlots
    .map((slot) => {
      const providerPreferenceBonus = customer?.preferredProviders.includes(slot.providerId) ? 24 : 0;
      const preferredWindowBonus =
        customer && toMinutes(slot.startTime) >= toMinutes(customer.preferredWindow[0]) && toMinutes(slot.startTime) <= toMinutes(customer.preferredWindow[1])
          ? 18
          : 0;
      const urgencyPenalty = slot.status === "emergency" ? -4 : 0;
      const loadPenalty = listProviderAppointments(state, slot.providerId, date).length * 4;
      const score = 100 + providerPreferenceBonus + preferredWindowBonus - urgencyPenalty - loadPenalty;

      return {
        ...slot,
        score,
        reason:
          preferredWindowBonus > 0
            ? "Recommended because it fits your usual preferred time."
            : providerPreferenceBonus > 0
              ? "Recommended because it matches your trusted specialist preference."
              : "Recommended because it has balanced availability and lower queue pressure."
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function buildInsights(state) {
  const pendingCount = state.appointments.filter((appointment) => appointment.status === "pending").length;
  const confirmedCount = state.appointments.filter((appointment) => appointment.status === "confirmed").length;
  const emergencyCount = state.appointments.filter((appointment) => appointment.priority === "emergency").length;

  return [
    {
      id: "insight-1",
      level: pendingCount > 2 ? "watch" : "good",
      title: "Admin approval load",
      detail: pendingCount > 2 ? "Admin queue is growing. Review pending bookings soon." : "Booking approvals are under control."
    },
    {
      id: "insight-2",
      level: emergencyCount > 0 ? "watch" : "good",
      title: "Emergency coverage",
      detail: emergencyCount > 0 ? "Emergency bookings are active. Reserved slots are being protected." : "Emergency capacity is available."
    },
    {
      id: "insight-3",
      level: state.waitlist.length > 1 ? "watch" : "good",
      title: "Waitlist monitor",
      detail: state.waitlist.length > 1 ? "Waitlist demand is rising. Consider opening more specialist hours." : "Waitlist pressure is currently low."
    },
    {
      id: "insight-4",
      level: confirmedCount > 5 ? "good" : "watch",
      title: "Bookings in motion",
      detail: confirmedCount > 5 ? "Confirmed bookings are moving smoothly across services." : "Approval is slowing the conversion into confirmed bookings."
    }
  ];
}

export function buildDashboard(state, role, userId) {
  const notifications = role === "customer" ? state.notifications.filter((item) => item.customerId === userId) : state.notifications;
  const appointments = state.appointments
    .filter((appointment) => {
      if (role === "customer") {
        return appointment.customerId === userId;
      }
      if (role === "admin") {
        return true;
      }
      return false;
    })
    .map((appointment) => getAppointmentDetails(appointment, state))
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));

  return {
    appointments,
    waitlist: state.waitlist.map((entry) => ({
      ...entry,
      service: state.maps.services.get(entry.serviceId),
      customer: state.maps.customers.get(entry.customerId),
      provider: entry.providerId ? state.maps.providers.get(entry.providerId) : null
    })),
    notifications,
    insights: buildInsights(state)
  };
}

export const customers = [
  {
    id: "cust-1",
    role: "customer",
    name: "Aisha Khan",
    email: "customer@example.com",
    password: "customer123",
    phone: "+91-9876543210",
    preferredProviders: ["prov-1", "prov-4"],
    preferredWindow: ["09:00", "15:00"]
  }
];

export const admins = [
  {
    id: "admin-1",
    role: "admin",
    name: "Operations Admin",
    email: "admin@example.com",
    password: "admin123",
    title: "Booking Operations Manager"
  }
];

export const providers = [
  {
    id: "prov-1",
    role: "specialist",
    name: "Dr. Maya Singh",
    title: "General Physician",
    serviceIds: ["svc-1", "svc-6"],
    email: "maya@example.com",
    location: "CarePoint Clinic",
    travelBufferMinutes: 20,
    availability: {
      1: [["08:00", "17:00"]],
      2: [["08:00", "17:00"]],
      3: [["09:00", "18:00"]],
      4: [["08:00", "17:00"]],
      5: [["08:00", "15:00"]]
    },
    emergencySlots: ["10:30", "11:00"]
  },
  {
    id: "prov-2",
    role: "specialist",
    name: "Rina Kapoor",
    title: "Salon Stylist",
    serviceIds: ["svc-2", "svc-7"],
    email: "rina@example.com",
    location: "Glow Lounge",
    travelBufferMinutes: 15,
    availability: {
      1: [["10:00", "20:00"]],
      2: [["10:00", "20:00"]],
      3: [["10:00", "20:00"]],
      4: [["10:00", "20:00"]],
      5: [["10:00", "21:00"]],
      6: [["11:00", "18:00"]]
    },
    emergencySlots: ["12:00", "12:30"]
  },
  {
    id: "prov-3",
    role: "specialist",
    name: "Arjun Mehta",
    title: "Mechanic Specialist",
    serviceIds: ["svc-3"],
    email: "arjun@example.com",
    location: "RapidFix Garage",
    travelBufferMinutes: 30,
    availability: {
      1: [["07:00", "16:00"]],
      2: [["07:00", "16:00"]],
      3: [["07:00", "16:00"]],
      4: [["07:00", "16:00"]],
      5: [["07:00", "16:00"]],
      6: [["08:00", "13:00"]]
    },
    emergencySlots: ["08:00", "08:30"]
  },
  {
    id: "prov-4",
    role: "specialist",
    name: "Neha Verma",
    title: "Child Specialist",
    serviceIds: ["svc-4", "svc-6"],
    email: "neha@example.com",
    location: "Prime Family Care",
    travelBufferMinutes: 20,
    availability: {
      1: [["09:00", "18:00"]],
      2: [["09:00", "18:00"]],
      3: [["09:00", "18:00"]],
      4: [["09:00", "18:00"]],
      5: [["09:00", "16:00"]]
    },
    emergencySlots: ["13:00", "13:30"]
  },
  {
    id: "prov-5",
    role: "specialist",
    name: "Kabir Das",
    title: "Home Repair Consultant",
    serviceIds: ["svc-5"],
    email: "kabir@example.com",
    location: "Home Assist Hub",
    travelBufferMinutes: 35,
    availability: {
      1: [["08:00", "17:00"]],
      2: [["08:00", "17:00"]],
      3: [["08:00", "17:00"]],
      4: [["08:00", "17:00"]],
      5: [["08:00", "17:00"]]
    },
    emergencySlots: ["09:00", "09:30"]
  }
];

export const services = [
  {
    id: "svc-1",
    name: "Doctor Consultation",
    category: "Healthcare",
    duration: 30,
    mode: "virtual",
    price: 299,
    bookingFee: 29,
    color: "#14b8a6",
    description: "Fast doctor consultation for fever, fatigue, follow-ups and general health concerns.",
    bestFor: "Best for people who want safe, affordable, quick care without long clinic waits.",
    specialists: ["General Physician", "Child Specialist"]
  },
  {
    id: "svc-2",
    name: "Salon Styling",
    category: "Beauty",
    duration: 60,
    mode: "in-person",
    price: 399,
    bookingFee: 39,
    color: "#f472b6",
    description: "Haircut, styling, grooming and beauty sessions with professional salon experts.",
    bestFor: "Best for customers looking for polished styling with easy slot booking and low booking fees.",
    specialists: ["Salon Stylist", "Beauty Expert"]
  },
  {
    id: "svc-3",
    name: "Mechanic Inspection",
    category: "Automotive",
    duration: 60,
    mode: "in-person",
    price: 349,
    bookingFee: 25,
    color: "#f59e0b",
    description: "Quick diagnosis, urgent vehicle checks and scheduled inspection with mechanic support.",
    bestFor: "Best for customers who need urgent diagnosis and clear time slots for vehicle repair visits.",
    specialists: ["Mechanic Specialist"]
  },
  {
    id: "svc-4",
    name: "Pediatric Care",
    category: "Healthcare",
    duration: 45,
    mode: "virtual",
    price: 349,
    bookingFee: 35,
    color: "#38bdf8",
    description: "Child-focused consultations for growth, illness review and preventive guidance.",
    bestFor: "Best for parents who need child care guidance with quick booking and easy virtual access.",
    specialists: ["Child Specialist"]
  },
  {
    id: "svc-5",
    name: "Home Repair Visit",
    category: "Home Services",
    duration: 90,
    mode: "in-person",
    price: 449,
    bookingFee: 49,
    color: "#fb7185",
    description: "Book electricians, repair consultants and home maintenance specialists.",
    bestFor: "Best for customers who want trusted help at low booking cost with proper travel-time planning.",
    specialists: ["Home Repair Consultant"]
  },
  {
    id: "svc-6",
    name: "Video Follow-up Session",
    category: "Video Consultation",
    duration: 30,
    mode: "virtual",
    price: 249,
    bookingFee: 19,
    color: "#818cf8",
    description: "Connect through video apps after booking for follow-ups, reports and health advice.",
    bestFor: "Best for people who prefer remote support and do not want to travel for simple follow-ups.",
    specialists: ["General Physician", "Child Specialist"]
  },
  {
    id: "svc-7",
    name: "Bridal / Event Styling",
    category: "Beauty",
    duration: 90,
    mode: "in-person",
    price: 699,
    bookingFee: 59,
    color: "#fb7185",
    description: "Premium event and bridal styling with specialist support.",
    bestFor: "Best for event-ready looks with careful scheduling and priority booking support.",
    specialists: ["Salon Stylist"]
  }
];

export const unavailability = [
  { id: "unav-1", providerId: "prov-1", date: "2026-04-15", from: "13:00", to: "14:00", reason: "Clinic review" },
  { id: "unav-2", providerId: "prov-3", date: "2026-04-16", from: "11:30", to: "12:30", reason: "Field service buffer" }
];

export const appointments = [
  {
    id: "appt-1",
    customerId: "cust-1",
    providerId: "prov-2",
    serviceId: "svc-2",
    date: "2026-04-16",
    startTime: "11:00",
    endTime: "12:00",
    priority: "priority",
    status: "pending",
    note: "Hair styling for event",
    paymentStatus: "authorized",
    payment: { amount: 438, bookingFee: 39, servicePrice: 399, currency: "INR", gateway: "SecurePay Demo" },
    notifications: ["notif-1", "notif-2"]
  }
];

export const waitlist = [
  { id: "wait-1", customerId: "cust-1", providerId: "prov-1", serviceId: "svc-1", date: "2026-04-15", preferredTimes: ["10:00", "11:30"], priority: "normal" }
];

export const notifications = [
  {
    id: "notif-1",
    customerId: "cust-1",
    channel: "email",
    destination: "customer@example.com",
    message: "Your salon appointment request has been placed and is waiting for admin approval.",
    createdAt: "2026-04-15T08:30:00Z"
  },
  {
    id: "notif-2",
    customerId: "cust-1",
    channel: "sms",
    destination: "+91-9876543210",
    message: "Booking request received. We will notify you after admin confirmation.",
    createdAt: "2026-04-15T08:31:00Z"
  }
];

export const chatMessages = [
  {
    id: "chat-1",
    conversationId: "customer-cust-1-prov-2",
    participantRole: "customer",
    participantId: "cust-1",
    providerId: "prov-2",
    senderType: "customer",
    senderId: "cust-1",
    senderName: "Aisha Khan",
    text: "Hi Rina, I booked the 11:00 AM slot for event styling. Can I share my reference look here?",
    createdAt: "2026-04-15T09:10:00Z"
  },
  {
    id: "chat-2",
    conversationId: "customer-cust-1-prov-2",
    participantRole: "customer",
    participantId: "cust-1",
    providerId: "prov-2",
    senderType: "specialist",
    senderId: "prov-2",
    senderName: "Rina Kapoor",
    text: "Absolutely. Send your reference photos and I will guide you on what works best for the appointment.",
    createdAt: "2026-04-15T09:12:00Z"
  },
  {
    id: "chat-3",
    conversationId: "admin-admin-1-prov-1",
    participantRole: "admin",
    participantId: "admin-1",
    providerId: "prov-1",
    senderType: "admin",
    senderId: "admin-1",
    senderName: "Operations Admin",
    text: "Please keep 10:30 AM reserved for urgent video follow-ups today.",
    createdAt: "2026-04-15T07:45:00Z"
  },
  {
    id: "chat-4",
    conversationId: "admin-admin-1-prov-1",
    participantRole: "admin",
    participantId: "admin-1",
    providerId: "prov-1",
    senderType: "specialist",
    senderId: "prov-1",
    senderName: "Dr. Maya Singh",
    text: "Noted. I am available and will keep that window ready for urgent support.",
    createdAt: "2026-04-15T07:49:00Z"
  }
];

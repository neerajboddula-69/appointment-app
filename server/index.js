import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import referenceRoutes from "./routes/referenceRoutes.js";
import { initializeAppointmentReminders } from "./services/reminderService.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", referenceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chat", chatRoutes);

initializeAppointmentReminders().catch((error) => {
  console.error("Unable to initialize appointment reminders.");
  console.error(error);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

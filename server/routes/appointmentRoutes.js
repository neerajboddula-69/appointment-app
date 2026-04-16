import { Router } from "express";
import {
  approveAppointment,
  cancelAppointment,
  createAppointment,
  deleteAppointment,
  getDashboard,
  getRecommendations,
  getSchedule,
  joinWaitlist,
  rescheduleAppointment
} from "../controllers/appointmentController.js";

const router = Router();

router.get("/schedule", getSchedule);
router.get("/recommendations", getRecommendations);
router.get("/dashboard", getDashboard);
router.post("/", createAppointment);
router.post("/waitlist", joinWaitlist);
router.patch("/:id/approve", approveAppointment);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);
router.delete("/:id", deleteAppointment);

export default router;

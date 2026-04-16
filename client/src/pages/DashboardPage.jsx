import AdminQueue from "../components/AdminQueue";
import AppointmentsPanel from "../components/AppointmentsPanel";
import RecommendationsPanel from "../components/RecommendationsPanel";
import ReschedulePanel from "../components/ReschedulePanel";
import { useApp } from "../services/appContext";

export default function DashboardPage() {
  const { session, dashboard, recommendations, cancelBooking, rescheduleBooking, joinWaitlist, approveBooking, deleteBooking } = useApp();

  const cancelledAppointments = dashboard.appointments.filter((appointment) => appointment.status === "cancelled");

  return (
    <section className="dashboard-page-grid">
      <div className="dashboard-main-column">
        <AppointmentsPanel role={session?.user.role} appointments={dashboard.appointments} onCancel={cancelBooking} onDelete={deleteBooking} />
        <ReschedulePanel appointments={cancelledAppointments} recommendation={recommendations[0]} onReschedule={rescheduleBooking} />
        <AdminQueue session={session} appointments={dashboard.appointments} onApprove={approveBooking} />
      </div>
      <div className="dashboard-side-column">
        {session?.user.role === "customer" ? (
          <RecommendationsPanel
            selectedDate={new Date().toISOString().slice(0, 10)}
            session={session}
            recommendations={recommendations}
            onJoinWaitlist={joinWaitlist}
          />
        ) : null}
      </div>
    </section>
  );
}

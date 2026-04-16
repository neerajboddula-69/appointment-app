import NotificationsPanel from "../components/NotificationsPanel";
import { useApp } from "../services/appContext";

export default function MessagesPage() {
  const { session, dashboard } = useApp();

  return (
    <section className="standalone-page-shell">
      <div className="section-intro section-intro-left">
        <span className="section-chip">{session?.user.role === "admin" ? "Operations inbox" : "Your updates"}</span>
        <h2>Messages</h2>
        <p>Keep track of booking requests, approvals, reminders, and delivery updates in one place.</p>
      </div>
      <NotificationsPanel notifications={dashboard.notifications} role={session?.user.role} />
    </section>
  );
}

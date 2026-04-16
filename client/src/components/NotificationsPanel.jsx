export default function NotificationsPanel({ notifications, role }) {
  const orderedNotifications = [...notifications].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return (
    <div className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">{role === "admin" ? "Activity stream" : "Booking updates"}</p>
          <h3>Notifications and messages</h3>
        </div>
      </div>
      <div className="appointment-list">
        {orderedNotifications.map((notification) => (
          <article key={notification.id} className="insight">
            <strong>{notification.channel.toUpperCase()}</strong>
            <p>{notification.message}</p>
            <small>{notification.destination}</small>
          </article>
        ))}
        {orderedNotifications.length === 0 ? <p className="helper-text">Notifications will appear here after booking actions.</p> : null}
      </div>
    </div>
  );
}

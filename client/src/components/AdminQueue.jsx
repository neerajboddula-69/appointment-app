export default function AdminQueue({ session, appointments, onApprove }) {
  if (session?.user.role !== "admin") {
    return null;
  }

  const pendingAppointments = appointments.filter((appointment) => appointment.status === "pending");

  return (
    <div className="card" id="dashboard">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin approval desk</p>
          <h3>Approve customer booking requests</h3>
        </div>
      </div>
      <div className="appointment-list">
        {pendingAppointments.map((appointment) => (
          <article key={appointment.id} className="appointment appointment-card">
            <div>
              <strong>
                {appointment.date} | {appointment.startTime}
              </strong>
              <p>
                {appointment.customer?.name} requested {appointment.service?.name}
              </p>
              <small>
                {appointment.customer?.email} | {appointment.priority} | {appointment.status}
              </small>
            </div>
            <button className="primary-button small" onClick={() => onApprove(appointment.id)}>
              Accept booking
            </button>
          </article>
        ))}
        {pendingAppointments.length === 0 ? <p className="helper-text">No pending bookings waiting for admin approval.</p> : null}
      </div>
    </div>
  );
}

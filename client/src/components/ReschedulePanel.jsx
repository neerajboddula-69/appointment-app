export default function ReschedulePanel({ appointments, recommendation, onReschedule }) {
  if (appointments.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Manual rescheduling</p>
          <h3>Cancelled appointments</h3>
        </div>
      </div>
      <div className="appointment-list">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="appointment stacked">
            <div>
              <strong>{appointment.service.name}</strong>
              <p>
                Cancelled on {appointment.date} at {appointment.startTime}
              </p>
            </div>
            {recommendation ? (
              <button className="primary-button small" onClick={() => onReschedule(appointment.id, recommendation)}>
                Reschedule to {recommendation.startTime}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

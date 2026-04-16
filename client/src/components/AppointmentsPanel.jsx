import { useState } from "react";

const cancellationOptions = [
  "Schedule conflict",
  "Found another provider",
  "Price or service issue",
  "Emergency or urgent situation",
  "No longer needed"
];

function getStatusMeta(status) {
  if (status === "pending") {
    return { label: "Pending Approval", className: "pending" };
  }

  if (status === "confirmed") {
    return { label: "Booked & Confirmed", className: "confirmed" };
  }

  if (status === "cancelled") {
    return { label: "Cancelled", className: "cancelled" };
  }

  return { label: "Booked", className: "booked" };
}

export default function AppointmentsPanel({ role, appointments, onCancel, onDelete }) {
  const [pendingCancelId, setPendingCancelId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState("");

  function isPastAppointment(appointment) {
    return new Date(`${appointment.date}T${appointment.startTime}:00+05:30`) < new Date();
  }

  function canDeleteAppointment(appointment) {
    return appointment.status === "cancelled" || isPastAppointment(appointment);
  }

  function startCancel(appointmentId) {
    setPendingCancelId(appointmentId);
    setCancelReason("");
  }

  function closeCancel() {
    setPendingCancelId("");
    setCancelReason("");
  }

  function startDelete(appointmentId) {
    setPendingDeleteId(appointmentId);
  }

  function closeDelete() {
    setPendingDeleteId("");
  }

  async function confirmCancel(appointmentId) {
    if (!cancelReason) {
      return;
    }

    await onCancel(appointmentId, cancelReason);
    closeCancel();
  }

  async function confirmDelete(appointmentId) {
    await onDelete?.(appointmentId);
    closeDelete();
  }

  return (
    <div className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">{role === "admin" ? "Admin overview" : "Your bookings"}</p>
          <h3>Appointments</h3>
        </div>
      </div>
      <div className="appointment-list">
        {appointments.length === 0 ? <p className="helper-text">No appointments yet. Book a slot and it will appear here.</p> : null}
        {appointments.map((appointment) => (
          <article key={appointment.id} className="appointment appointment-card status-card">
            <div>
              <strong>
                {appointment.date} | {appointment.startTime}
              </strong>
              <p>{appointment.service.name}</p>
              <div className="appointment-status-row">
                <span className={`status-badge ${getStatusMeta(appointment.status).className}`}>{getStatusMeta(appointment.status).label}</span>
                <small>{appointment.priority} booking</small>
              </div>
              <small>{role === "admin" ? appointment.customer?.name || "Customer" : appointment.provider.name}</small>
              {role === "admin" ? <small>{appointment.customer?.email || "No customer email available"}</small> : null}
            </div>
            {role === "customer" && ["pending", "confirmed"].includes(appointment.status) ? (
              <div className="cancel-stack">
                <button className="ghost-button" onClick={() => startCancel(appointment.id)}>
                  Cancel
                </button>
                {pendingCancelId === appointment.id ? (
                  <div className="cancel-box">
                    <p className="cancel-title">Select a cancellation reason</p>
                    <select value={cancelReason} onChange={(event) => setCancelReason(event.target.value)}>
                      <option value="">Choose a reason</option>
                      {cancellationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="cancel-actions">
                      <button className="primary-button small" disabled={!cancelReason} onClick={() => confirmCancel(appointment.id)}>
                        Confirm cancel
                      </button>
                      <button className="ghost-button small" onClick={closeCancel}>
                        Close
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            {canDeleteAppointment(appointment) ? (
              <div className="cancel-stack">
                <button className="ghost-button" onClick={() => startDelete(appointment.id)}>
                  Delete
                </button>
                {pendingDeleteId === appointment.id ? (
                  <div className="cancel-box">
                    <p className="cancel-title">Delete this appointment permanently?</p>
                    <div className="cancel-actions">
                      <button className="primary-button small" onClick={() => confirmDelete(appointment.id)}>
                        Confirm delete
                      </button>
                      <button className="ghost-button small" onClick={closeDelete}>
                        Close
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

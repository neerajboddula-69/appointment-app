import { formatDateLabel } from "../services/dateUtils";

export default function BookingBar({ activeSlot, selectedServiceName, bookingNote, setBookingNote, session, onConfirm }) {
  if (!activeSlot) {
    return null;
  }

  return (
    <section className="booking-bar card">
      <div>
        <p className="eyebrow">Selected slot</p>
        <h3>
          {activeSlot.startTime} on {formatDateLabel(activeSlot.date)}
        </h3>
        <p>
          {activeSlot.providerName} | {selectedServiceName}
        </p>
      </div>
      <label className="note-field">
        Booking note
        <input value={bookingNote} onChange={(event) => setBookingNote(event.target.value)} placeholder="Add booking details or urgency notes" />
      </label>
      {session?.user.role === "customer" ? (
        <button className="primary-button" onClick={() => onConfirm(activeSlot)}>
          Confirm booking
        </button>
      ) : (
        <p className="helper-text">Customer login is required to book a slot.</p>
      )}
    </section>
  );
}

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingWorkspace({
  session,
  service,
  specialist,
  providers,
  selectedProvider,
  setSelectedProvider,
  selectedDate,
  setSelectedDate,
  schedule,
  activeSlot,
  setActiveSlot,
  recommendations,
  bookingPriority,
  setBookingPriority,
  onBook,
  bookingSubmitting
}) {
  const navigate = useNavigate();
  const daySlots = schedule.filter((slot) => slot.date === selectedDate);
  const recommendedKeys = useMemo(
    () => new Set(recommendations.map((item) => `${item.providerId}-${item.startTime}`)),
    [recommendations]
  );

  async function handleBook() {
    if (!activeSlot) {
      return;
    }

    if (!session || session.user.role !== "customer") {
      navigate("/auth");
      return;
    }

    await onBook(activeSlot);
  }

  function handleSlotPick(slot) {
    if (slot.status === "emergency" && bookingPriority === "normal") {
      setBookingPriority("emergency");
    }
    setActiveSlot(slot);
  }

  function handleRecommendationPick(item) {
    if (item.status === "emergency" && bookingPriority === "normal") {
      setBookingPriority("emergency");
    }
    if (selectedProvider !== item.providerId) {
      setSelectedProvider(item.providerId);
    }
    setActiveSlot(item);
  }

  return (
    <section className="booking-page-shell">
      <div className="breadcrumb">Services / {service?.name || "Select Service"} / Book Appointment</div>

      <article className="specialist-summary-card">
        <div className="specialist-avatar">SP</div>
        <div>
          <h2>{specialist?.name || "Select a Specialist"}</h2>
          <p>{specialist?.title || "Specialist"}</p>
        </div>
      </article>

      <article className="booking-board-card">
        <div className="booking-board-head">
          <h3>Select Date & Time</h3>
          <div className="slot-legend">
            <span><i className="legend-dot available" /> Available</span>
            <span><i className="legend-dot booked" /> Booked</span>
            <span><i className="legend-dot emergency" /> Emergency</span>
            <span><i className="legend-dot recommended" /> Smart pick</span>
          </div>
        </div>

        <div className="booking-controls-card">
          <label>
            Specialist
            <select value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)}>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} - {provider.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Booking Type
            <select value={bookingPriority} onChange={(event) => setBookingPriority(event.target.value)}>
              <option value="normal">Normal booking</option>
              <option value="priority">Priority booking</option>
              <option value="emergency">Emergency booking</option>
            </select>
          </label>
        </div>

        <div className="booking-grid">
          <div className="mini-calendar">
            <strong>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</strong>
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </div>

          <div className="slot-column">
            <p className="booking-date-label">AVAILABLE ON {new Date(`${selectedDate}T00:00:00`).toDateString().toUpperCase()}</p>

            {recommendations.length > 0 ? (
              <div className="smart-slot-panel">
                <div className="smart-slot-head">
                  <strong>Smart slot recommendations</strong>
                  <span>Best availability for your booking type</span>
                </div>
                <div className="smart-slot-list">
                  {recommendations.slice(0, 3).map((item) => (
                    <button
                      key={`${item.providerId}-${item.startTime}`}
                      className={activeSlot?.providerId === item.providerId && activeSlot?.startTime === item.startTime ? "smart-slot-chip active" : "smart-slot-chip"}
                      onClick={() => handleRecommendationPick(item)}
                    >
                      <strong>{item.startTime}</strong>
                      <span>{item.providerName}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="slot-selection-grid">
              {daySlots.map((slot) => {
                const slotKey = `${slot.providerId}-${slot.startTime}`;
                const isRecommended = recommendedKeys.has(slotKey);
                const isActive = activeSlot?.providerId === slot.providerId && activeSlot?.startTime === slot.startTime;

                return (
                  <button
                  key={slotKey}
                  className={isActive ? `time-slot-card ${slot.status} ${isRecommended ? "recommended" : ""} active` : `time-slot-card ${slot.status} ${isRecommended ? "recommended" : ""}`}
                  disabled={["booked", "pending", "buffer"].includes(slot.status)}
                  onClick={() => handleSlotPick(slot)}
                >
                  <strong>{slot.startTime}</strong>
                  <span>{isRecommended ? "Recommended" : slot.label}</span>
                </button>
                );
              })}
            </div>

            <div className="booking-action-bar">
              <div className="selected-slot-summary">
                <strong>{activeSlot ? `${activeSlot.startTime} selected` : "Choose a slot to book"}</strong>
                <span>
                  {bookingPriority === "emergency"
                    ? "Emergency booking will prioritize urgent support."
                    : bookingPriority === "priority"
                      ? "Priority booking unlocks fast-track slots."
                      : "Normal booking uses regular available slots."}
                </span>
              </div>
              <button className="hero-primary direct-book-button" disabled={!activeSlot || bookingSubmitting} onClick={handleBook}>
                {bookingSubmitting ? "Booking..." : bookingPriority === "emergency" ? "Book Emergency Appointment" : "Book Appointment"}
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

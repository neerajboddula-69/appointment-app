export default function CalendarPanel({ monthView, selectedDate, setSelectedDate, schedule, selectedProvider, legend, onSlotSelect }) {
  return (
    <div className="card calendar-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Full calendar</p>
          <h3>{monthView.monthLabel}</h3>
        </div>
        <div className="legend">
          {legend.map((item) => (
            <span key={item.label}>
              <i className={`dot ${item.className}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="calendar-grid">
        {monthView.days.map((day) => {
          const dayLabel = new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" });
          return (
            <button key={day} className={day === selectedDate ? "calendar-day active" : "calendar-day"} onClick={() => setSelectedDate(day)}>
              <strong>{new Date(`${day}T00:00:00`).getDate()}</strong>
              <span>{dayLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="slot-grid">
        {schedule
          .filter((slot) => !selectedProvider || slot.providerId === selectedProvider)
          .map((slot) => (
                <button
                  key={`${slot.providerId}-${slot.startTime}`}
                  className={`slot-card ${slot.status}`}
                  disabled={slot.status === "booked" || slot.status === "pending" || slot.status === "buffer" || slot.status === "unavailable"}
                  onClick={() => onSlotSelect(slot)}
                >
                  <span>{slot.startTime}</span>
              <strong>{slot.providerName}</strong>
              <small>{slot.label}</small>
            </button>
          ))}
      </div>
    </div>
  );
}

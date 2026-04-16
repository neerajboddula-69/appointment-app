import { formatDateLabel } from "../services/dateUtils";

export default function RecommendationsPanel({ selectedDate, session, recommendations, onJoinWaitlist, onBook }) {
  return (
    <div className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Smart recommendations</p>
          <h3>Best time slots for {formatDateLabel(selectedDate)}</h3>
        </div>
        {session?.user.role === "customer" ? (
          <button className="ghost-button" onClick={onJoinWaitlist}>
            Join waitlist
          </button>
        ) : null}
      </div>
      <div className="recommendation-list">
        {recommendations.map((item) => (
          <article key={`${item.providerId}-${item.startTime}`} className="recommendation">
            <div>
              <strong>{item.startTime}</strong>
              <p>{item.providerName}</p>
              <small>{item.reason}</small>
            </div>
                  {session?.user.role === "customer" && onBook ? (
                    <button className="primary-button small" onClick={() => onBook(item)}>
                      Book
                    </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

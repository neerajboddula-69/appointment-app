export default function InsightsPanel({ insights }) {
  return (
    <div className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">AI monitor</p>
          <h3>Operational insights</h3>
        </div>
      </div>
      <div className="insight-list">
        {insights.map((insight) => (
          <article key={insight.id} className={`insight ${insight.level}`}>
            <h4>{insight.title}</h4>
            <p>{insight.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

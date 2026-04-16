const reasons = [
  {
    title: "Affordable booking",
    detail: "Low booking fees and transparent payment summary keep appointment costs easy to understand."
  },
  {
    title: "Smart slot guidance",
    detail: "Recommendations highlight the best time slots based on availability, priority and queue pressure."
  },
  {
    title: "One place, many needs",
    detail: "Doctor, salon, mechanic, pediatric care, home repair and video follow-up services are all available."
  }
];

export default function WhyChooseSection() {
  return (
    <section id="why" className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Why this works for you</p>
          <h3>Start with value, not just a service list.</h3>
        </div>
      </div>
      <div className="story-grid">
        {reasons.map((reason) => (
          <article key={reason.title} className="story-card">
            <h4>{reason.title}</h4>
            <p>{reason.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

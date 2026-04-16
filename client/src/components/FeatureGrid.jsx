const items = [
  {
    icon: "IM",
    title: "Instant Messaging",
    text: "Chat with your specialist before and after appointments for quick queries."
  },
  {
    icon: "SN",
    title: "Smart Notifications",
    text: "Get instant email alerts for bookings, confirmations, and reminders."
  },
  {
    icon: "VP",
    title: "Verified Professionals",
    text: "All specialists are background-checked and certified in their fields."
  },
  {
    icon: "SS",
    title: "Smart Scheduling",
    text: "AI-powered slot recommendations based on availability and your preferences."
  },
  {
    icon: "ER",
    title: "Easy Rescheduling",
    text: "Change or cancel appointments with just a click and clear reasons."
  }
];

export default function FeatureGrid() {
  return (
    <section className="content-section" id="how-it-works">
      <div className="section-intro">
        <span className="section-chip">Premium Services</span>
        <h2>Why Choose BookIt?</h2>
        <p>Everything you need for seamless appointment management.</p>
      </div>
      <div className="feature-grid">
        {items.map((item) => (
          <article key={item.title} className="feature-card">
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

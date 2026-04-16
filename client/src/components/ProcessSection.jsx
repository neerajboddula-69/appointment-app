import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Choose Service",
    text: "Select from our wide range of professional services."
  },
  {
    number: "02",
    title: "Pick Specialist",
    text: "Browse verified specialists with ratings and reviews."
  },
  {
    number: "03",
    title: "Book Slot",
    text: "Choose your preferred date and time with smart recommendations."
  },
  {
    number: "04",
    title: "Get Updates",
    text: "Chat with your specialist, receive approval updates, and get reminder emails before the appointment."
  }
];

export default function ProcessSection() {
  return (
    <section className="content-section">
      <div className="section-intro">
        <h2>Simple 4-Step Process</h2>
        <p>From booking to completion in minutes.</p>
      </div>

      <div className="process-row">
        {steps.map((step, index) => (
          <div key={step.number} className="process-item">
            <div className="process-bubble">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {index < steps.length - 1 ? <span className="process-arrow">→</span> : null}
          </div>
        ))}
      </div>

      <div className="cta-band">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied customers booking appointments with ease.</p>
        <Link className="cta-button" to="/services">
          Book Your First Appointment
        </Link>
      </div>
    </section>
  );
}

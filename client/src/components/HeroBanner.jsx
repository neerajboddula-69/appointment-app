import { Link } from "react-router-dom";
import { useApp } from "../services/appContext";

export default function HeroBanner() {
  const { session } = useApp();

  return (
    <section className="hero-banner">
      <span className="hero-badge">#1 Appointment Booking Platform</span>
      <h1>
        Book Professionals
        <br />
        <span>In Just 60 Seconds</span>
      </h1>
      <p>
        Connect with verified specialists across multiple services. Instant messaging, timely reminders, and real-time booking updates all in one
        place.
      </p>
      <div className="hero-actions">
        <Link className="hero-primary" to={session ? "/services" : "/auth?mode=register"}>
          Book Now
        </Link>
        <a className="hero-secondary" href="#how-it-works">
          How It Works
        </a>
      </div>
    </section>
  );
}

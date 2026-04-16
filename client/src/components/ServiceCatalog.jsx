import { Link } from "react-router-dom";
import { useApp } from "../services/appContext";

export default function ServiceCatalog({ services, selectedService, onSelect, compact = false }) {
  const { session } = useApp();
  const list = compact ? services.slice(0, 6) : services;

  return (
    <section className="content-section">
      <div className="section-intro">
        <span className="section-chip">Premium Services</span>
        <h2>Explore Our Services</h2>
        <p>Book appointments with top-rated professionals across multiple categories.</p>
      </div>
      <div className="services-grid">
        {list.map((service) => (
          <article key={service.id} className={service.id === selectedService ? "service-tile active" : "service-tile"}>
            <div className="service-icon" style={{ background: service.color }}>
              {service.name.slice(0, 1)}
            </div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-footer">
              <strong>From INR {service.price}</strong>
              <Link to={session ? "/booking" : "/auth?mode=register"} onClick={() => onSelect?.(service.id)}>
                Book Now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

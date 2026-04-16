export default function ServiceShowcase({ services, selectedService, onSelect }) {
  return (
    <section id="services" className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Service categories</p>
          <h3>Choose from multiple appointment types and specialists.</h3>
        </div>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <button
            key={service.id}
            className={service.id === selectedService ? "service-card active" : "service-card"}
            onClick={() => onSelect(service.id)}
          >
            <span className="service-pill">{service.category}</span>
            <h4>{service.name}</h4>
            <p>{service.bestFor}</p>
            <small>
              Specialists: {service.specialists.join(", ")} | INR {service.price}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

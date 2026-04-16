export default function FiltersPanel({
  services,
  providers,
  selectedService,
  selectedProvider,
  selectedDate,
  bookingPriority,
  onServiceChange,
  onProviderChange,
  onDateChange,
  onPriorityChange
}) {
  return (
    <section className="filters card">
      <div>
        <label>Service</label>
        <select value={selectedService} onChange={(event) => onServiceChange(event.target.value)}>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} | {service.category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Specialist</label>
        <select value={selectedProvider} onChange={(event) => onProviderChange(event.target.value)}>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name} | {provider.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Date</label>
        <input type="date" value={selectedDate} onChange={(event) => onDateChange(event.target.value)} />
      </div>
      <div>
        <label>Priority</label>
        <select value={bookingPriority} onChange={(event) => onPriorityChange(event.target.value)}>
          <option value="normal">Normal</option>
          <option value="priority">Priority</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
    </section>
  );
}

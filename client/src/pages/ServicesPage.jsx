import ServiceCatalog from "../components/ServiceCatalog";
import { useApp } from "../services/appContext";

export default function ServicesPage() {
  const { services, selectedService, setSelectedService } = useApp();

  return <ServiceCatalog services={services} selectedService={selectedService} onSelect={setSelectedService} />;
}

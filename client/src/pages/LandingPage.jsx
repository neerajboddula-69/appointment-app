import FeatureGrid from "../components/FeatureGrid";
import HeroBanner from "../components/HeroBanner";
import ProcessSection from "../components/ProcessSection";
import ServiceCatalog from "../components/ServiceCatalog";
import { useApp } from "../services/appContext";

export default function LandingPage() {
  const { services, setSelectedService } = useApp();

  return (
    <>
      <HeroBanner />
      <ServiceCatalog services={services} onSelect={setSelectedService} compact />
      <FeatureGrid />
      <ProcessSection />
    </>
  );
}

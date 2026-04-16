import BookingWorkspace from "../components/BookingWorkspace";
import { useApp } from "../services/appContext";

export default function BookingPage() {
  const {
    session,
    providers,
    services,
    selectedService,
    selectedProvider,
    setSelectedProvider,
    selectedDate,
    setSelectedDate,
    schedule,
    activeSlot,
    setActiveSlot,
    recommendations,
    bookingPriority,
    setBookingPriority,
    createBooking,
    loading
  } = useApp();

  const service = services.find((item) => item.id === selectedService);
  const specialist = providers.find((item) => item.id === selectedProvider);

  return (
    <BookingWorkspace
      session={session}
      service={service}
      specialist={specialist}
      providers={providers.filter((item) => item.serviceIds.includes(selectedService))}
      selectedProvider={selectedProvider}
      setSelectedProvider={setSelectedProvider}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      schedule={schedule}
      activeSlot={activeSlot}
      setActiveSlot={setActiveSlot}
      recommendations={recommendations}
      bookingPriority={bookingPriority}
      setBookingPriority={setBookingPriority}
      onBook={createBooking}
      bookingSubmitting={loading}
    />
  );
}

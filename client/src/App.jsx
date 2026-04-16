import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import { AppProvider, useApp } from "./services/appContext";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import MessagesPage from "./pages/MessagesPage";
import ServicesPage from "./pages/ServicesPage";

function ProtectedRoute({ children, allow }) {
  const { session } = useApp();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (allow && !allow.includes(session.user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allow={["customer", "admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allow={["customer", "admin"]}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute allow={["customer", "admin"]}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AppProvider>
  );
}

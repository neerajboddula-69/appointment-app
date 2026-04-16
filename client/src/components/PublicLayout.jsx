import { Outlet, useLocation } from "react-router-dom";
import { useApp } from "../services/appContext";
import MessageBar from "./MessageBar";
import TopNavbar from "./TopNavbar";

export default function PublicLayout() {
  const { session, logout, message } = useApp();
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className={isChatPage ? "site-shell site-shell-chat" : "site-shell"}>
      <TopNavbar session={session} onLogout={logout} />
      <MessageBar message={message} />
      <Outlet />
    </div>
  );
}

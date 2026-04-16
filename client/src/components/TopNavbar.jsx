import { Link, NavLink } from "react-router-dom";

export default function TopNavbar({ session, onLogout }) {
  return (
    <header className="topbar">
      <Link className="brandmark" to="/">
        <span className="brandmark-icon">+</span>
        <span>BookIt</span>
      </Link>
      <nav className="topnav-links">
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/booking">Book Appointment</NavLink>
        {session ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/messages">Messages</NavLink>
            <NavLink to="/chat">Chat</NavLink>
          </>
        ) : null}
      </nav>
      <div className="topnav-actions">
        {session ? (
          <>
            <span className="signed-user">{session.user.name}</span>
            <button className="ghost-link" onClick={onLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-link" to="/auth">
              Sign in
            </Link>
            <Link className="primary-pill" to="/auth">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

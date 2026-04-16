export default function Navbar({ session }) {
  return (
    <nav className="navbar">
      <div>
        <p className="eyebrow">Online Appointment Booking System</p>
        <h2 className="navbar-title">MERN Appointment Hub</h2>
      </div>
      <div className="nav-links">
        <a href="#why">Why us</a>
        <a href="#services">Services</a>
        <a href="#booking">Booking</a>
        <a href="#video">Video consult</a>
        <a href="#dashboard">{session?.user.role === "admin" ? "Admin desk" : "Dashboard"}</a>
      </div>
    </nav>
  );
}

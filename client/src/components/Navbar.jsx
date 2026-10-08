import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // The booking page lives under /reservations but belongs to the Rooms flow.
  const isBooking = pathname.startsWith("/reservations/book");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar-custom">
      <div className="container navbar-grid py-3">
        <Link to="/" className="navbar-brand-custom">
          {BRAND_NAME}
        </Link>

        <nav className="d-none d-md-flex align-items-center justify-content-center gap-5">
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `nav-link-custom${isActive || isBooking ? " active" : ""}`
            }
          >
            Rooms
          </NavLink>
          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              `nav-link-custom${isActive && !isBooking ? " active" : ""}`
            }
          >
            My reservations
          </NavLink>
          <NavLink to="/profile" className="nav-link-custom">
            Profile
          </NavLink>
        </nav>

        {/* ...right-side user chip section unchanged... */}
      </div>
    </header>
  );
}

export default Navbar;
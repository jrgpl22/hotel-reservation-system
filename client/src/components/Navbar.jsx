import { Link, NavLink, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
          <NavLink to="/rooms" className="nav-link-custom">
            Rooms
          </NavLink>
          <NavLink to="/reservations" className="nav-link-custom">
            My reservations
          </NavLink>
          <NavLink to="/profile" className="nav-link-custom">
            Profile
          </NavLink>
        </nav>

        <div className="d-flex align-items-center justify-content-end gap-3">
          {isAuthenticated ? (
            <div className="user-chip">
              <Link to="/profile" className="user-chip-avatar">
                {user.name.charAt(0).toUpperCase()}
              </Link>
              <Link to="/profile" className="user-chip-name d-none d-lg-inline">
                {user.name.split(" ")[0]}
              </Link>
              <button className="user-chip-logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Book a stay
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

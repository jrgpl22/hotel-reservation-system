import { NavLink, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/rooms", label: "Rooms" },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/users", label: "Users" },
];

function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="admin-sidebar d-flex flex-column">
      <div>
        <div className="admin-sidebar-brand">{BRAND_NAME}</div>
        <nav className="d-flex flex-column gap-1 mt-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `admin-sidebar-link${isActive ? " active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="admin-sidebar-footer mt-auto">
        <div className="admin-sidebar-user">
          <span className="admin-sidebar-avatar">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="mb-0 text-small" style={{ color: "#F7F3EA" }}>
              {user.name}
            </p>
            <p
              className="mb-0 text-small"
              style={{ color: "#8FA39C", fontSize: "0.78rem" }}
            >
              {user.role}
            </p>
          </div>
        </div>
        <button className="admin-sidebar-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

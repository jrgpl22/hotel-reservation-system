import { NavLink, Link } from "react-router-dom";
import { BRAND_NAME, USER_ROLES } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

const { ADMIN, STAFF } = USER_ROLES;

const links = [
  { to: "/admin", label: "Dashboard", end: true, roles: [ADMIN, STAFF] },
  { to: "/admin/rooms", label: "Rooms", roles: [ADMIN] },
  { to: "/admin/reservations", label: "Reservations", roles: [ADMIN, STAFF] },
  { to: "/admin/users", label: "Users", roles: [ADMIN] },
];

function AdminSidebar({ open = false, onNavigate = () => {} }) {
  const { user } = useAuth();
  const visibleLinks = links.filter((link) => link.roles.includes(user.role));

  return (
    <aside className={`admin-sidebar d-flex flex-column${open ? " open" : ""}`}>
      <div>
        <div className="admin-sidebar-brand">{BRAND_NAME}</div>
        <nav className="d-flex flex-column gap-1 mt-4">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onNavigate}
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
        <Link to="/" className="admin-sidebar-link" onClick={onNavigate}>
          View website
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;

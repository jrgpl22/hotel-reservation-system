import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/constants";

function AdminTopBar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="admin-topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="admin-menu-btn d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
        <span className="text-small text-muted-custom">
          {ROLE_LABELS[user.role]} panel
        </span>
      </div>

      <div className="user-chip">
        <Link
          to="/admin/profile"
          className="user-chip-avatar"
          aria-label="My profile"
        >
          {user.name.charAt(0).toUpperCase()}
        </Link>
        <Link to="/admin/profile" className="user-chip-name d-none d-sm-inline">
          {user.name}
        </Link>
        <button className="user-chip-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default AdminTopBar;

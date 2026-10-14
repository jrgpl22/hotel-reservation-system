import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS, USER_ROLES } from "../../utils/constants";
import ImageUploader from "../ImageUploader";
import Icon from "../Icon";
import Toast from "../Toast";

const GUEST_LINKS = [
  { to: "/reservations", label: "My reservations" },
  { to: "/rooms", label: "Browse rooms" },
];

const STAFF_LINKS = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/reservations", label: "Reservations" },
];

function ProfileSummary() {
  const { user, updateProfile } = useAuth();
  const [toast, setToast] = useState(null);
  const links = user.role === USER_ROLES.GUEST ? GUEST_LINKS : STAFF_LINKS;

  const handleAvatarChange = async (path) => {
    await updateProfile({ avatar: path });
    setToast({
      message: path ? "Profile photo updated" : "Profile photo removed",
      type: "success",
      id: Date.now(),
    });
  };

  return (
    <div className="surface profile-card">
      <ImageUploader
        kind="avatar"
        stacked
        name={user.name}
        value={user.avatar}
        onChange={handleAvatarChange}
        hint="JPG, PNG, or WebP. Saved right away."
      />

      <h4 className="mt-4 mb-2">{user.name}</h4>
      <span className={`badge-status badge-role-${user.role}`}>
        {ROLE_LABELS[user.role]}
      </span>

      <ul className="profile-meta">
        <li>
          <Icon name="mail" size={16} />
          {user.email}
        </li>
        <li>
          <Icon name="phone" size={16} />
          {user.phone || "No phone number added"}
        </li>
      </ul>

      <nav className="profile-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="profile-link">
            {link.label}
            <Icon name="chevron" size={16} />
          </Link>
        ))}
      </nav>

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ProfileSummary;

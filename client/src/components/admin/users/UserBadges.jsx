import { ROLE_LABELS } from "../../../utils/constants";

export function RoleBadge({ role }) {
  return (
    <span className={`badge-status badge-role-${role}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

export function AccountStatusBadge({ isActive }) {
  return (
    <span
      className={`badge-status ${isActive ? "badge-active" : "badge-inactive"}`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

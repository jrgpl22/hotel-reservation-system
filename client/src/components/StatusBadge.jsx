const LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  available: "Available",
  maintenance: "Maintenance",
};

function StatusBadge({ status }) {
  const key = status?.toLowerCase();
  return (
    <span className={`badge-status badge-${key}`}>{LABELS[key] || status}</span>
  );
}

export default StatusBadge;

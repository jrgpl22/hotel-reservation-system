import { Link } from "react-router-dom";

function QuickActions({ pendingCount = 0 }) {
  return (
    <div
      className="surface p-4 h-100 stagger-in"
      style={{ animationDelay: "540ms" }}
    >
      <h4 className="mb-1">Quick actions</h4>
      <p className="text-small text-muted-custom mb-4">
        Jump to the tools you use most.
      </p>

      {pendingCount > 0 && (
        <div className="dash-callout mb-4">
          <p className="fw-semibold text-small mb-1">
            {pendingCount}{" "}
            {pendingCount === 1 ? "reservation needs" : "reservations need"}{" "}
            confirmation
          </p>
          <Link
            to="/admin/reservations"
            className="fw-semibold text-small"
            style={{ color: "var(--color-primary)" }}
          >
            Review now
          </Link>
        </div>
      )}

      <div className="d-grid gap-2">
        <Link to="/admin/reservations" className="btn btn-primary">
          View reservations
        </Link>
        <Link to="/admin/rooms" className="btn btn-outline-primary">
          Manage rooms
        </Link>
      </div>
    </div>
  );
}

export default QuickActions;

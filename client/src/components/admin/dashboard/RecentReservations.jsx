import { Link } from "react-router-dom";
import StatusBadge from "../../StatusBadge";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      })
    : "—";

function RecentReservations({ reservations }) {
  return (
    <div className="surface stagger-in" style={{ animationDelay: "480ms" }}>
      <div className="d-flex align-items-center justify-content-between p-4 pb-3">
        <div>
          <h4 className="mb-1">Recent reservations</h4>
          <p className="text-small text-muted-custom mb-0">
            The latest bookings made by guests.
          </p>
        </div>
        <Link
          to="/admin/reservations"
          className="btn btn-outline-primary btn-sm"
        >
          View all
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="state-message">
          <h4>No reservations yet</h4>
          <p className="mb-0">
            New bookings will appear here as soon as guests make them.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Reservation #</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td className="fw-semibold">
                    {reservation.reservationNumber}
                  </td>
                  <td>
                    {reservation.guestName ?? (
                      <span className="text-muted-custom">Deleted guest</span>
                    )}
                  </td>
                  <td>{reservation.roomNumber ?? "—"}</td>
                  <td>{formatDate(reservation.checkIn)}</td>
                  <td>{formatDate(reservation.checkOut)}</td>
                  <td>
                    <StatusBadge status={reservation.status} />
                  </td>
                  <td className="text-end">
                    <Link
                      to={`/reservations/${reservation._id}`}
                      className="fw-semibold text-small"
                      style={{ color: "var(--color-primary)" }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentReservations;

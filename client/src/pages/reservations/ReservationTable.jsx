import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import ReservationStatusActions from "./ReservationStatusActions";
import { formatPeso, formatDate } from "./reservationHelpers";

export default function ReservationTable({ reservations, busyId, onUpdate, onCancel }) {
  return (
    <div className="surface" style={{ overflowX: "auto" }}>
      <table className="table mb-0">
        <thead>
          <tr>
            <th>Reservation #</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Guests</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r._id}>
              <td>{r.reservationNumber}</td>
              <td>
                {r.user?.name || "Unknown"}
                {r.user?.email && (
                  <div className="text-muted-custom text-small">{r.user.email}</div>
                )}
              </td>
              <td>{r.room ? `${r.room.roomNumber} · ${r.room.roomType}` : "Unavailable"}</td>
              <td>{formatDate(r.checkIn)}</td>
              <td>{formatDate(r.checkOut)}</td>
              <td>{r.guests}</td>
              <td>{formatPeso(r.totalAmount)}</td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>
                <div className="d-flex flex-column gap-2">
                  <Link to={`/reservations/${r._id}`} className="btn-outline-primary">
                    View details
                  </Link>
                  <ReservationStatusActions
                    reservation={r}
                    busy={busyId === r._id}
                    onUpdate={onUpdate}
                    onCancel={onCancel}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
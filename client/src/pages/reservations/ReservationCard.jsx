import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { RESERVATION_STATUS } from "../../utils/constants";
import { formatPeso, formatDate, todayISO } from "./reservationHelpers";

export default function ReservationCard({ reservation, onCancel }) {
  const { _id, reservationNumber, room, checkIn, checkOut, guests, totalAmount, status } =
    reservation;

  const isActive =
    status === RESERVATION_STATUS.PENDING || status === RESERVATION_STATUS.CONFIRMED;
  // Backend enforces this too; we just hide the button once check-in has passed
  const canCancel = isActive && checkIn.slice(0, 10) >= todayISO();

  return (
    <div className="card p-4 mb-3">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <p className="eyebrow mb-1">Reservation #{reservationNumber}</p>
          <h3 className="h5 mb-0">
            {room ? `Room ${room.roomNumber} · ${room.roomType}` : "Room unavailable"}
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="row g-3 text-small mb-3">
        <div className="col-6 col-md-3">
          <div className="text-muted-custom">Check-in</div>
          <div>{formatDate(checkIn)}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-muted-custom">Check-out</div>
          <div>{formatDate(checkOut)}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-muted-custom">Guests</div>
          <div>{guests}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-muted-custom">Total</div>
          <div><strong>{formatPeso(totalAmount)}</strong></div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2">
        <Link to={`/reservations/${_id}`} className="btn-outline-primary">
          View details
        </Link>
        {canCancel && (
          <button type="button" className="btn-danger" onClick={() => onCancel(reservation)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
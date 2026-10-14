import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES, RESERVATION_STATUS } from "../../utils/constants";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import ReservationStatusActions from "./ReservationStatusActions";
import {
  formatPeso,
  formatDate,
  formatDateTime,
  todayISO,
} from "./reservationHelpers";

function Detail({ label, children }) {
  return (
    <div className="col-6 col-md-4">
      <div className="text-muted-custom text-small">{label}</div>
      <div>{children}</div>
    </div>
  );
}

export default function ReservationDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const isStaff =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.STAFF;

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [toast, setToast] = useState(
    location.state?.justBooked
      ? {
          message: "Reservation created successfully",
          type: "success",
          id: Date.now(),
        }
      : null,
  );

  const showToast = (message, type = "success") =>
    setToast({ message, type, id: Date.now() });

  const fetchReservation = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/reservations/${id}`);
      setReservation(res.data.reservation);
    } catch (err) {
      setError(err.userMessage || "Failed to load reservation.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  const confirmCancel = async () => {
    setBusy(true);
    try {
      const res = await api.patch(`/reservations/${id}/cancel`);
      setReservation(res.data.reservation);
      showToast("Reservation cancelled successfully");
    } catch (err) {
      showToast(err.userMessage || "Failed to cancel reservation.", "error");
    } finally {
      setShowCancel(false);
      setBusy(false);
    }
  };

  const updateStatus = async (_reservation, nextStatus) => {
    setBusy(true);
    try {
      const res = await api.patch(`/reservations/${id}/status`, {
        status: nextStatus,
      });
      setReservation(res.data.reservation);
      showToast(`Reservation marked as ${nextStatus}`);
    } catch (err) {
      showToast(err.userMessage || "Failed to update status.", "error");
    } finally {
      setBusy(false);
    }
  };

  const backLink = isStaff ? "/admin/reservations" : "/reservations";

  if (loading) {
    return (
      <div className="container section">
        <Loading label="Loading reservation..." />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="container section">
        <ErrorMessage
          message={error || "Reservation not found."}
          onRetry={fetchReservation}
        />
      </div>
    );
  }

  const {
    reservationNumber,
    room,
    user: guest,
    checkIn,
    checkOut,
    guests,
    totalAmount,
    status,
    createdAt,
  } = reservation;

  const isActive =
    status === RESERVATION_STATUS.PENDING ||
    status === RESERVATION_STATUS.CONFIRMED;
  const guestCanCancel = isActive && checkIn.slice(0, 10) >= todayISO();

  return (
    <div className="container section">
      <Link to={backLink} className="back-link">
        &larr; Back to reservations
      </Link>

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mt-4 mb-5">
        <div>
          <p className="eyebrow mb-2">Reservation</p>
          <h1 className="mb-1">#{reservationNumber}</h1>
          <p className="text-muted-custom mb-0">
            Everything about this booking in one place.
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="surface p-4 mb-4">
        <div className="row g-4">
          <Detail label="Guest">
            {guest?.name || user?.name}
            {guest?.email && (
              <div className="text-muted-custom text-small">{guest.email}</div>
            )}
          </Detail>
          <Detail label="Room">
            {room
              ? `Room ${room.roomNumber} · ${room.roomType}`
              : "Room unavailable"}
          </Detail>
          <Detail label="Guests">{guests}</Detail>
          <Detail label="Check-in">{formatDate(checkIn)}</Detail>
          <Detail label="Check-out">{formatDate(checkOut)}</Detail>
          <Detail label="Total amount">
            <strong>{formatPeso(totalAmount)}</strong>
          </Detail>
          <Detail label="Created">{formatDateTime(createdAt)}</Detail>
        </div>
      </div>

      {isStaff ? (
        <ReservationStatusActions
          reservation={reservation}
          busy={busy}
          onUpdate={updateStatus}
          onCancel={() => setShowCancel(true)}
        />
      ) : (
        guestCanCancel && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowCancel(true)}
          >
            Cancel reservation
          </button>
        )
      )}

      {showCancel && (
        <Modal
          title="Cancel reservation?"
          confirmLabel={busy ? "Cancelling..." : "Cancel reservation"}
          cancelLabel="Keep reservation"
          danger
          onClose={() => !busy && setShowCancel(false)}
          onConfirm={confirmCancel}
        >
          Are you sure you want to cancel reservation #{reservationNumber}? This
          cannot be undone.
        </Modal>
      )}

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

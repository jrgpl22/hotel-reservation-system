import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ReservationFilters from "./ReservationFilters";
import ReservationCard from "./ReservationCard";

const PAGE_SIZE = 5;

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") =>
    setToast({ message, type, id: Date.now() });

  // Debounce search (350ms) and go back to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/reservations/my", {
        params: { page, limit: PAGE_SIZE, search: debouncedSearch, status },
      });
      setReservations(res.data.reservations);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.userMessage || "Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await api.patch(`/reservations/${cancelTarget._id}/cancel`);
      showToast("Reservation cancelled successfully");
      setCancelTarget(null);
      fetchReservations();
    } catch (err) {
      showToast(err.userMessage || "Failed to cancel reservation.", "error");
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  };

  const hasFilters = Boolean(debouncedSearch || status);

  return (
    <div className="container section">
      <div className="mb-5">
        <p className="eyebrow mb-2">Your stays</p>
        <h1 className="mb-1">My reservations</h1>
        <p className="text-muted-custom mb-0">
          Track your upcoming and past stays.
        </p>
      </div>

      <ReservationFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={handleStatusChange}
      />

      {loading ? (
        <Loading label="Loading reservations..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchReservations} />
      ) : reservations.length === 0 ? (
        <EmptyState
          icon="calendar"
          title={
            hasFilters
              ? "No reservations match your search"
              : "No reservations yet"
          }
          message={
            hasFilters
              ? "Try a different search or clear the filters."
              : "When you book a room, your stay will show up here."
          }
          action={
            !hasFilters && (
              <Link to="/rooms" className="btn btn-primary">
                Browse rooms
              </Link>
            )
          }
        />
      ) : (
        <>
          {reservations.map((r) => (
            <ReservationCard
              key={r._id}
              reservation={r}
              onCancel={setCancelTarget}
            />
          ))}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {cancelTarget && (
        <Modal
          title="Cancel reservation?"
          confirmLabel={cancelling ? "Cancelling..." : "Cancel reservation"}
          cancelLabel="Keep reservation"
          danger
          onClose={() => !cancelling && setCancelTarget(null)}
          onConfirm={confirmCancel}
        >
          Are you sure you want to cancel reservation #
          {cancelTarget.reservationNumber}? This cannot be undone.
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

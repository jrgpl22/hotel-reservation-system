import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ReservationFilters from "../reservations/ReservationFilters";
import ReservationTable from "../reservations/ReservationTable";

const PAGE_SIZE = 10;

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  const [cancelTarget, setCancelTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);
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
      const res = await api.get("/reservations", {
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

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const updateStatus = async (reservation, nextStatus) => {
    setBusyId(reservation._id);
    try {
      await api.patch(`/reservations/${reservation._id}/status`, {
        status: nextStatus,
      });
      showToast(
        `Reservation #${reservation.reservationNumber} marked as ${nextStatus}`,
      );
      fetchReservations();
    } catch (err) {
      showToast(err.userMessage || "Failed to update status.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setBusyId(cancelTarget._id);
    try {
      await api.patch(`/reservations/${cancelTarget._id}/cancel`);
      showToast("Reservation cancelled successfully");
      fetchReservations();
    } catch (err) {
      showToast(err.userMessage || "Failed to cancel reservation.", "error");
    } finally {
      setCancelTarget(null);
      setBusyId(null);
    }
  };

  const hasFilters = Boolean(debouncedSearch || status);

  return (
    <div>
      <div className="mb-5">
        <p className="eyebrow mb-2">Manage</p>
        <h1 className="mb-1">Reservations</h1>
        <p className="text-muted-custom mb-0">
          Review, confirm, and complete guest bookings.
        </p>
      </div>

      <ReservationFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={handleStatusFilter}
        searchPlaceholder="Search by reservation number, guest name, or room number"
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
              : "New bookings will appear here as soon as guests make them."
          }
        />
      ) : (
        <>
          <ReservationTable
            reservations={reservations}
            busyId={busyId}
            onUpdate={updateStatus}
            onCancel={setCancelTarget}
          />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      {cancelTarget && (
        <Modal
          title="Cancel reservation?"
          confirmLabel={busyId ? "Cancelling..." : "Cancel reservation"}
          cancelLabel="Keep reservation"
          danger
          onClose={() => !busyId && setCancelTarget(null)}
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

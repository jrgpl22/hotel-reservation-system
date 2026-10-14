import { useEffect, useState } from "react";
import api from "../../services/api";
import RoomForm from "../../components/rooms/RoomForm";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Modal, { ModalShell } from "../../components/Modal";
import Toast from "../../components/Toast";
import {
  resolveImageUrl,
  getRoomImages,
  FALLBACK_ROOM_IMAGE,
} from "../../utils/images";
function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const res = await api.get("/rooms", { params });
      setRooms(res.data.rooms);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.userMessage || "Unable to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRooms, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const openAddForm = () => {
    setEditingRoom(null);
    setShowForm(true);
  };
  const openEditForm = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };
  const showToast = (message, type = "success") =>
    setToast({ message, type, id: Date.now() });
  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, data);
        showToast("Room updated successfully");
      } else {
        await api.post("/rooms", data);
        showToast("Room added successfully");
      }
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      showToast(err.userMessage || "Something went wrong", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.delete(`/rooms/${target._id}`);
      showToast("Room deleted successfully");
      fetchRooms();
    } catch (err) {
      showToast(err.userMessage || "Unable to delete this room", "error");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="mb-1">Manage rooms</h1>
          <p className="text-muted-custom mb-0">
            Add, edit, and update room availability.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddForm}>
          Add room
        </button>
      </div>

      <div className="mb-4" style={{ maxWidth: 320 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading && <Loading label="Loading rooms..." />}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRooms} />
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="state-message surface">
          <h4>No rooms found</h4>
          <p className="mb-0">
            Try a different search, or add your first room.
          </p>
        </div>
      )}

      {!loading && !error && rooms.length > 0 && (
        <div className="surface" style={{ overflowX: "auto" }}>
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Price / night</th>
                <th>Capacity</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        className="room-thumb"
                        src={resolveImageUrl(getRoomImages(room)[0], {
                          width: 120,
                          fallback: FALLBACK_ROOM_IMAGE,
                        })}
                        alt=""
                      />
                      <span className="fw-semibold">{room.roomNumber}</span>
                    </div>
                  </td>
                  <td>{room.roomType}</td>
                  <td>₱{room.pricePerNight?.toLocaleString()}</td>
                  <td>{room.capacity}</td>
                  <td>
                    <StatusBadge status={room.status} />
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => openEditForm(room)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(room)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {showForm && (
        <ModalShell onClose={() => setShowForm(false)}>
          <h4 className="mb-4">
            {editingRoom ? "Edit room" : "Add a new room"}
          </h4>
          <RoomForm
            initialData={editingRoom}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        </ModalShell>
      )}

      {deleteTarget && (
        <Modal
          title="Delete this room?"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          confirmLabel="Delete room"
          danger
        >
          Room {deleteTarget.roomNumber} will be permanently removed. This
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

export default AdminRoomsPage;

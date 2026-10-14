import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Modal, { ModalShell } from "../../components/Modal";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import UserFilters from "../../components/admin/users/UserFilters";
import UserTable from "../../components/admin/users/UserTable";
import UserForm from "../../components/admin/users/UserForm";
import UserDetails from "../../components/admin/users/UserDetails";

const PAGE_SIZE = 10;
const EMPTY_FILTERS = { search: "", role: "", status: "" };

function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [viewing, setViewing] = useState(null);
  const [details, setDetails] = useState({
    userId: null,
    loading: false,
    error: "",
    data: null,
  });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") =>
    setToast({ message, type, id: Date.now() });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: PAGE_SIZE };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const res = await api.get("/users", { params });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      setError(err.userMessage || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 350); // small debounce for the search field
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const openDetails = async (user) => {
    setViewing(user);
    setDetails({ userId: user._id, loading: true, error: "", data: null });
    try {
      const res = await api.get(`/users/${user._id}`);
      // Ignore the response if a different user was opened in the meantime
      setDetails((prev) =>
        prev.userId === user._id
          ? {
              userId: user._id,
              loading: false,
              error: "",
              data: res.data.reservations,
            }
          : prev,
      );
    } catch (err) {
      setDetails((prev) =>
        prev.userId === user._id
          ? {
              userId: user._id,
              loading: false,
              error: err.userMessage || "Unable to load reservations.",
              data: null,
            }
          : prev,
      );
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await api.put(`/users/${editing._id}`, data);
      showToast("User updated successfully");
      setEditing(null);
      fetchUsers();
    } catch (err) {
      showToast(err.userMessage || "Unable to update this user", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.delete(`/users/${target._id}`);
      showToast("User deleted successfully");
      // If that was the last row on this page, step back one page
      if (users.length === 1 && page > 1) setPage(page - 1);
      else fetchUsers();
    } catch (err) {
      showToast(err.userMessage || "Unable to delete this user", "error");
    }
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="mb-5">
        <p className="eyebrow mb-2">Manage</p>
        <h1 className="mb-1">Users</h1>
        <p className="text-muted-custom mb-0">
          View accounts, manage roles, and control access.
        </p>
      </div>

      <UserFilters filters={filters} onChange={handleFilterChange} />

      {!loading && !error && (
        <p className="text-small text-muted-custom mb-3">
          {totalItems} {totalItems === 1 ? "user" : "users"}
        </p>
      )}

      {loading && <Loading label="Loading users..." />}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchUsers} />
      )}

      {!loading && !error && users.length === 0 && (
        <div className="state-message surface">
          <h4>{hasFilters ? "No users match your search" : "No users yet"}</h4>
          <p className="mb-0">
            {hasFilters
              ? "Try a different search or clear the filters."
              : "Registered accounts will appear here."}
          </p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <UserTable
            users={users}
            currentUserId={currentUser?.id}
            onView={openDetails}
            onEdit={setEditing}
            onDelete={setDeleteTarget}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {viewing && (
        <ModalShell onClose={() => setViewing(null)} maxWidth={560}>
          <UserDetails
            user={viewing}
            details={details}
            onClose={() => setViewing(null)}
            onEdit={() => {
              setEditing(viewing);
              setViewing(null);
            }}
          />
        </ModalShell>
      )}

      {editing && (
        <ModalShell onClose={() => setEditing(null)} maxWidth={520}>
          <h4 className="mb-4">Edit user</h4>
          <UserForm
            user={editing}
            isSelf={editing._id === currentUser?.id}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            loading={saving}
          />
        </ModalShell>
      )}

      {deleteTarget && (
        <Modal
          title="Delete this user?"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          confirmLabel="Delete user"
          danger
        >
          {deleteTarget.name} will be permanently removed. Users with
          reservation history cannot be deleted. Deactivate them instead.
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

export default AdminUsersPage;

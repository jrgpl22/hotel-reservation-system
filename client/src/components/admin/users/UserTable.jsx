import { RoleBadge, AccountStatusBadge } from "./UserBadges";
import { formatDate } from "../../../utils/formatters";

function UserTable({ users, currentUserId, onView, onEdit, onDelete }) {
  return (
    <div className="surface" style={{ overflowX: "auto" }}>
      <table className="table mb-0">
        <thead>
          <tr>
            <th>User</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user._id === currentUserId;
            return (
              <tr key={user._id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <span className="user-chip-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="fw-semibold mb-0">
                        {user.name}
                        {isSelf && (
                          <span className="text-small text-muted-custom fw-normal">
                            {" "}
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-small text-muted-custom mb-0">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{user.phone || "—"}</td>
                <td>
                  <RoleBadge role={user.role} />
                </td>
                <td>
                  <AccountStatusBadge isActive={user.isActive} />
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td className="text-end text-nowrap">
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => onView(user)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(user)}
                    disabled={isSelf}
                    title={
                      isSelf ? "You cannot delete your own account" : undefined
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

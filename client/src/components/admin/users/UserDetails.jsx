import { RoleBadge, AccountStatusBadge } from "./UserBadges";
import StatusBadge from "../../StatusBadge";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";
import { formatDate } from "../../../utils/formatters";
import Avatar from "../../Avatar";
function DetailField({ label, value }) {
  return (
    <div className="col-sm-6">
      <p className="text-small text-muted-custom mb-1">{label}</p>
      <p className="mb-0" style={{ wordBreak: "break-word" }}>
        {value}
      </p>
    </div>
  );
}

function UserDetails({ user, details, onClose, onEdit }) {
  const { loading, error, data } = details;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Avatar name={user.name} src={user.avatar} size="lg" />
        <div>
          <h4 className="mb-2">{user.name}</h4>
          <div className="d-flex flex-wrap gap-2">
            <RoleBadge role={user.role} />
            <AccountStatusBadge isActive={user.isActive} />
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <DetailField label="Email" value={user.email} />
        <DetailField label="Phone" value={user.phone || "—"} />
        <DetailField label="Member since" value={formatDate(user.createdAt)} />
        <DetailField label="Last updated" value={formatDate(user.updatedAt)} />
      </div>

      <h4 className="mb-3">Reservations</h4>

      {loading && <Loading label="Loading reservations..." />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading &&
        !error &&
        data &&
        (data.total === 0 ? (
          <p className="text-small text-muted-custom mb-0">
            This user has not made any reservations yet.
          </p>
        ) : (
          <>
            <p className="text-small text-muted-custom mb-3">
              {data.total} in total. Showing the latest {data.recent.length}.
            </p>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {data.recent.map((reservation) => (
                <li key={reservation._id} className="user-reservation-row">
                  <div>
                    <p className="fw-semibold text-small mb-0">
                      {reservation.reservationNumber}
                    </p>
                    <p className="text-small text-muted-custom mb-0">
                      Room {reservation.room?.roomNumber ?? "—"} ·{" "}
                      {formatDate(reservation.checkIn)} to{" "}
                      {formatDate(reservation.checkOut)}
                    </p>
                  </div>
                  <StatusBadge status={reservation.status} />
                </li>
              ))}
            </ul>
          </>
        ))}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-outline-primary btn-sm" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-primary btn-sm" onClick={onEdit}>
          Edit user
        </button>
      </div>
    </div>
  );
}

export default UserDetails;

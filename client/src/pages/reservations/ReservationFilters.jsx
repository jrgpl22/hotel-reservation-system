import { RESERVATION_STATUS } from "../../utils/constants";

const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ReservationFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  searchPlaceholder = "Search by reservation number or room",
}) {
  return (
    <div className="surface p-4 mb-5">
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="res-search">Search</label>
          <input
            id="res-search"
            type="text"
            className="form-control"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="res-status">Status</label>
          <select
            id="res-status"
            className="form-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All statuses</option>
            {Object.values(RESERVATION_STATUS).map((s) => (
              <option key={s} value={s}>{label(s)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
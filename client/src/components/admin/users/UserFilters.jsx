import { USER_ROLES, ROLE_LABELS } from "../../../utils/constants";

function UserFilters({ filters, onChange }) {
  const handleChange = (e) =>
    onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="surface p-4 mb-4">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Search</label>
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Search by name, email, or phone"
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="col-sm-6 col-md-3">
          <label className="form-label">Role</label>
          <select
            name="role"
            className="form-select"
            value={filters.role}
            onChange={handleChange}
          >
            <option value="">All roles</option>
            {Object.values(USER_ROLES).map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-6 col-md-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All accounts</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default UserFilters;

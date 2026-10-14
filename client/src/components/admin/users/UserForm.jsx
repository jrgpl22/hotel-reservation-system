import { useState } from "react";
import { USER_ROLES, ROLE_LABELS } from "../../../utils/constants";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

const ROLE_HINTS = {
  [USER_ROLES.GUEST]: "Can book rooms and manage their own reservations.",
  [USER_ROLES.STAFF]: "Can view and manage reservations.",
  [USER_ROLES.ADMIN]: "Full access, including rooms and users.",
};

function UserForm({ user, isSelf, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    role: user.role,
    status: user.isActive ? "active" : "inactive",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const found = {};
    if (!form.name.trim()) found.name = "Please enter a name";
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) {
      found.phone = "Enter a valid phone number";
    }
    return found;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      role: form.role,
      isActive: form.status === "active",
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Full name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <div className="invalid-feedback d-block">{errors.name}</div>
          )}
        </div>

        <div className="col-sm-6">
          <label className="form-label">Email address</label>
          <input
            type="text"
            className="form-control"
            value={user.email}
            disabled
          />
        </div>

        <div className="col-sm-6">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <div className="invalid-feedback d-block">{errors.phone}</div>
          )}
        </div>

        <div className="col-sm-6">
          <label className="form-label">Role</label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
            disabled={isSelf}
          >
            {Object.values(USER_ROLES).map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
          <p className="text-small text-muted-custom mt-1 mb-0">
            {ROLE_HINTS[form.role]}
          </p>
        </div>

        <div className="col-sm-6">
          <label className="form-label">Account status</label>
          <select
            name="status"
            className="form-select"
            value={form.status}
            onChange={handleChange}
            disabled={isSelf}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p className="text-small text-muted-custom mt-1 mb-0">
            Inactive accounts cannot sign in. Reservation history is kept.
          </p>
        </div>

        {isSelf && (
          <div className="col-12">
            <div className="dash-callout text-small">
              You cannot change your own role or deactivate your own account.
            </div>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary btn-sm ${loading ? "btn-loading" : ""}`}
          disabled={loading}
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

export default UserForm;

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ImageUploader from "../ImageUploader";
import Toast from "../Toast";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") =>
    setToast({ message, type, id: Date.now() });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const found = {};
    if (!form.name.trim()) found.name = "Please enter your name";
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) {
      found.phone = "Enter a valid phone number";
    }
    if (form.password && form.password.length < 6) {
      found.password = "Password must be at least 6 characters";
    }
    return found;
  };

  const handleAvatarChange = async (path) => {
    await updateProfile({ avatar: path });
    showToast(path ? "Profile photo updated" : "Profile photo removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setLoading(true);
    try {
      const payload = { name: form.name.trim(), phone: form.phone.trim() };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setForm((prev) => ({ ...prev, password: "" }));
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.userMessage || "Unable to update your profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <ImageUploader
          kind="avatar"
          label="Profile photo"
          name={user.name}
          value={user.avatar}
          onChange={handleAvatarChange}
          hint="JPG, PNG, or WebP. Saved right away."
        />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
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

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="text"
            className="form-control"
            value={user.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <div className="invalid-feedback d-block">{errors.phone}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">
            New password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${loading ? "btn-loading" : ""}`}
          disabled={loading}
        >
          Save changes
        </button>
      </form>

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

export default ProfileForm;

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setMessage("Profile updated successfully");
      setForm({ ...form, password: "" });
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-tight">
      <div
        className="surface"
        style={{ maxWidth: 520, padding: "var(--space-5)" }}
      >
        <p className="eyebrow mb-2">Account</p>
        <h2 className="mb-4">Your profile</h2>

        {message && (
          <div
            className="mb-3 p-3"
            style={{
              background: "var(--color-success-soft)",
              color: "var(--color-success)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
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
              className="form-control"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              New password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              minLength={6}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "btn-loading" : ""}`}
              disabled={loading}
            >
              Save changes
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;

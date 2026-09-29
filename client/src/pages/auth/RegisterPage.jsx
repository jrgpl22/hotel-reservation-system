import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Please enter your full name";
    if (!form.email.trim()) {
      errors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      errors.password = "Please enter a password";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="surface auth-card">
        <p className="eyebrow mb-2">Join us</p>
        <h2 className="mb-4">Create your account</h2>

        {formError && (
          <div
            className="mb-3 p-3"
            style={{
              background: "var(--color-danger-soft)",
              color: "var(--color-danger)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.9rem",
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
              value={form.name}
              onChange={handleChange}
            />
            {fieldErrors.name && (
              <div className="invalid-feedback d-block">{fieldErrors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="text"
              name="email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <div className="invalid-feedback d-block">
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
              value={form.password}
              onChange={handleChange}
            />
            {fieldErrors.password && (
              <div className="invalid-feedback d-block">
                {fieldErrors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-100 mb-3 ${loading ? "btn-loading" : ""}`}
            disabled={loading}
          >
            Create account
          </button>

          <p className="text-small text-muted-custom text-center mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

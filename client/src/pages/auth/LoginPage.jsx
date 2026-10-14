import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getHomePath } from "../../utils/constants";
function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getHomePath(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = "Please enter your email address";
    if (!form.password) errors.password = "Please enter your password";
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
      const user = await login(form.email, form.password);
      const redirectTo =
        location.state?.from?.pathname || getHomePath(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="surface auth-card">
        <p className="eyebrow mb-2">Welcome back</p>
        <h2 className="mb-4">Sign in to your account</h2>

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
            <label className="form-label">Email address</label>
            <input
              type="text"
              name="email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <div className="invalid-feedback d-block">
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
              placeholder="••••••••"
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
            Sign in
          </button>

          <p className="text-small text-muted-custom text-center mb-0">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="fw-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

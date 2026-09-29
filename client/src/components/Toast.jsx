import { useEffect, useState } from "react";

function Toast({ message, type = "success", onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (exiting) {
      const timer = setTimeout(onClose, 220); // matches --duration-base
      return () => clearTimeout(timer);
    }
  }, [exiting, onClose]);

  return (
    <div
      className={`toast-custom ${type === "error" ? "toast-error" : ""} ${exiting ? "toast-exit" : ""}`}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1080,
        minWidth: 280,
      }}
      role="alert"
    >
      <p className="mb-0 fw-semibold text-small">
        {type === "error" ? "⚠ " : "✓ "}
        {message}
      </p>
    </div>
  );
}

export default Toast;

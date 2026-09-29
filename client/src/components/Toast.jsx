import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ICONS = {
  success: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  warning: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="16" x2="12" y2="11" />
      <circle cx="12" cy="7.5" r="0.6" fill="currentColor" />
    </svg>
  ),
};

const TITLES = {
  success: "Success",
  error: "Something went wrong",
  warning: "Heads up",
  info: "Note",
};

function Toast({ message, type = "success", onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (exiting) {
      const timer = setTimeout(onClose, 250);
      return () => clearTimeout(timer);
    }
  }, [exiting, onClose]);

  return createPortal(
    <div className="toast-wrap">
      <div
        className={`toast-custom toast-${type} ${exiting ? "toast-exit" : ""}`}
        role="alert"
      >
        <span className="toast-icon">{ICONS[type]}</span>
        <div>
          <p className="toast-title mb-0">{TITLES[type]}</p>
          <p className="toast-body mb-0">{message}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Toast;

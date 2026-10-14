import { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

// Closes on Escape and locks page scroll while a modal is open
function useModalBehavior(onClose) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);
}

function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
}) {
  useModalBehavior(onClose);

  return createPortal(
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-center-wrap">
        <div
          className="modal-dialog-custom modal-scroll"
          style={{ width: "100%", maxWidth: 420 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-pad">
            {danger && (
              <span className="modal-icon">
                <Icon name="alert" size={22} />
              </span>
            )}
            <h4 className="mb-2">{title}</h4>
            <div className="text-muted-custom mb-4">{children}</div>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={onClose}
              >
                {cancelLabel}
              </button>
              <button
                className={`btn btn-sm ${danger ? "btn-danger" : "btn-primary"}`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// For modals with custom content (forms). Scrolls when taller than the screen.
export function ModalShell({ children, onClose, maxWidth = 640 }) {
  useModalBehavior(onClose);

  return createPortal(
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-center-wrap">
        <div
          className="modal-dialog-custom modal-scroll"
          style={{ width: "100%", maxWidth }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-pad">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;

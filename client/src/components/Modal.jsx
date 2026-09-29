import { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  danger = false,
}) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-center-wrap">
        <div
          className="modal-dialog-custom p-4"
          style={{ maxWidth: 420 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <h4 className="mb-2">{title}</h4>
          <div className="text-muted-custom mb-4">{children}</div>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onClose}
            >
              Cancel
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
    </div>,
    document.body,
  );
}

// A second, reusable export for modals with custom content (forms, etc.)
// instead of the fixed confirm/cancel footer above.
export function ModalShell({ children, onClose, maxWidth = 640 }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-center-wrap">
        <div
          className="modal-dialog-custom p-4"
          style={{ width: "100%", maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
//Usage later (e.g. cancelling a reservation):
// {showModal && (
//   <Modal
//     title="Cancel reservation?"
//     onClose={() => setShowModal(false)}
//     onConfirm={handleCancel}
//     confirmLabel="Cancel reservation"
//     danger
//   >
//     This action cannot be undone.
//   </Modal>
// )}

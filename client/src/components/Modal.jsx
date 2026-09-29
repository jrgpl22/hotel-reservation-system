import { useEffect } from "react";

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
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ position: "fixed", inset: 0, zIndex: 1060 }}
      >
        <div
          className="modal-dialog-custom p-4"
          style={{ width: "90%", maxWidth: 420 }}
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
    </div>
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

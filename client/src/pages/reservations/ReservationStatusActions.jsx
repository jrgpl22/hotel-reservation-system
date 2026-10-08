import { RESERVATION_STATUS } from "../../utils/constants";

// Valid next steps for each status (matches the backend rules)
const NEXT_STATUS = {
  [RESERVATION_STATUS.PENDING]: [RESERVATION_STATUS.CONFIRMED],
  [RESERVATION_STATUS.CONFIRMED]: [RESERVATION_STATUS.COMPLETED],
};

const ACTION_LABEL = {
  [RESERVATION_STATUS.CONFIRMED]: "Confirm",
  [RESERVATION_STATUS.COMPLETED]: "Mark completed",
};

export default function ReservationStatusActions({ reservation, onUpdate, onCancel, busy }) {
  const { status } = reservation;
  const nextSteps = NEXT_STATUS[status] || [];
  const canCancel =
    status === RESERVATION_STATUS.PENDING || status === RESERVATION_STATUS.CONFIRMED;

  // Cancelled and completed are final
  if (nextSteps.length === 0 && !canCancel) {
    return <span className="text-muted-custom text-small">No actions available</span>;
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {nextSteps.map((next) => (
        <button
          key={next}
          type="button"
          className="btn-primary"
          disabled={busy}
          onClick={() => onUpdate(reservation, next)}
        >
          {ACTION_LABEL[next]}
        </button>
      ))}
      {canCancel && (
        <button
          type="button"
          className="btn-danger"
          disabled={busy}
          onClick={() => onCancel(reservation)}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
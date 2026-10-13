import StatusBreakdown from "./StatusBreakdown";

function ReservationSummary({ reservations }) {
  return (
    <StatusBreakdown
      title="Reservation summary"
      subtitle={`${reservations.total} reservations in total`}
      delay={420}
      segments={[
        { label: "Pending", value: reservations.pending, tone: "warning" },
        { label: "Confirmed", value: reservations.confirmed, tone: "success" },
        { label: "Completed", value: reservations.completed, tone: "info" },
        { label: "Cancelled", value: reservations.cancelled, tone: "danger" },
      ]}
    />
  );
}

export default ReservationSummary;

import StatusBreakdown from "./StatusBreakdown";

function RoomSummary({ rooms }) {
  return (
    <StatusBreakdown
      title="Room summary"
      subtitle={`${rooms.total} rooms in the system`}
      delay={360}
      segments={[
        { label: "Available", value: rooms.available, tone: "success" },
        { label: "Maintenance", value: rooms.maintenance, tone: "warning" },
      ]}
    />
  );
}

export default RoomSummary;

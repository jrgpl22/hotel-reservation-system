import Icon from "./Icon";

function EmptyState({ icon = "calendar", title, message, action }) {
  return (
    <div className="empty-state surface">
      <span className="empty-state-icon">
        <Icon name={icon} size={26} />
      </span>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

export default EmptyState;

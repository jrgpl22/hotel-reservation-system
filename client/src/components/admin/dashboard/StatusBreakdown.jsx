function StatusBreakdown({ title, subtitle, segments, delay = 0 }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div
      className="surface p-4 h-100 stagger-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h4 className="mb-1">{title}</h4>
      <p className="text-small text-muted-custom mb-4">{subtitle}</p>

      <div className="dash-bar" role="img" aria-label={`${title} breakdown`}>
        {segments.map(
          (segment) =>
            segment.value > 0 && (
              <div
                key={segment.label}
                className={`dash-bar-seg dash-seg-${segment.tone}`}
                style={{ width: `${(segment.value / total) * 100}%` }}
                title={`${segment.label}: ${segment.value}`}
              />
            ),
        )}
      </div>

      {total === 0 && (
        <p className="text-small text-muted-custom mt-3 mb-0">
          Nothing to show yet.
        </p>
      )}

      <ul className="list-unstyled d-flex flex-column gap-2 mt-4 mb-0">
        {segments.map((segment) => (
          <li
            key={segment.label}
            className="d-flex align-items-center justify-content-between text-small"
          >
            <span className="d-flex align-items-center gap-2">
              <span className={`dash-dot dash-dot-${segment.tone}`} />
              {segment.label}
            </span>
            <span className="fw-semibold">{segment.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StatusBreakdown;

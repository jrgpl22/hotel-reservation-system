function StatCard({ label, value, hint, tone = "neutral", delay = 0 }) {
  return (
    <div
      className="card card-hover stagger-in h-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className={`dash-dot dash-dot-${tone}`} />
          <span className="text-small text-muted-custom">{label}</span>
        </div>
        <p className="dash-stat-value mb-1">{value}</p>
        {hint && <p className="text-small text-muted-custom mb-0">{hint}</p>}
      </div>
    </div>
  );
}

export default StatCard;

function Loading({ label = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5">
      <div className="spinner-custom" />
      <p className="text-small text-muted-custom mb-0">{label}</p>
    </div>
  );
}

export default Loading;

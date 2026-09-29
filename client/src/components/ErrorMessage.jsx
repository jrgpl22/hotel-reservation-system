function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="state-message surface">
      <h4>Something went wrong</h4>
      <p className="mb-3">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-primary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

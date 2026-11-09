export default function ErrorState({ message, onRetry }) {
  return (
    <div className="meal-state meal-state-error" role="alert">
      <p>{message}</p>
      <button type="button" className="meal-retry" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}

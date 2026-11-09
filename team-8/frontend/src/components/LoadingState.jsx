export default function LoadingState() {
  return (
    <div className="meal-state" role="status" aria-live="polite">
      <div className="meal-skeleton-grid" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div className="meal-skeleton" key={i} />
        ))}
      </div>
      <p>급식 정보를 불러오는 중...</p>
    </div>
  );
}

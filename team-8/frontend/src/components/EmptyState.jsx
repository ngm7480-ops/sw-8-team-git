export default function EmptyState({ date }) {
  return (
    <div className="meal-state meal-state-empty" role="status">
      <p>{date} · 이 날은 급식이 없어요.</p>
    </div>
  );
}

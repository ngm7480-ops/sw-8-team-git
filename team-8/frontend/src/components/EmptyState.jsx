export default function EmptyState({ date }) {
  return (
    <div className="meal-state meal-state-empty">
      <p>{date} 에는 급식 정보가 없습니다.</p>
    </div>
  );
}

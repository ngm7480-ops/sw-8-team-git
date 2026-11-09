const LABELS = { 조식: "🌅 조식", 중식: "🍚 중식", 석식: "🌙 석식" };

export default function MealCard({ meal }) {
  const menu = Array.isArray(meal.menu) ? meal.menu : [];
  return (
    <article className="meal-card">
      <h3>{LABELS[meal.type] ?? meal.type}</h3>
      {menu.length > 0 ? (
        <ul>
          {menu.map((item, i) => (
            <li key={`${i}-${item}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="meal-card-none">메뉴 정보 없음</p>
      )}
      {meal.calories ? <span className="meal-calories">{meal.calories}</span> : null}
    </article>
  );
}

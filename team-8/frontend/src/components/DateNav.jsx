export default function DateNav({ date, onChange, onToday }) {
  return (
    <div className="meal-date-nav">
      <button type="button" className="meal-arrow" aria-label="전날" onClick={() => onChange(-1)}>
        ‹
      </button>
      <input
        type="date"
        className="meal-date-input"
        value={date}
        aria-label="날짜 선택"
        onChange={(e) => e.target.value && onChange(e.target.value)}
      />
      <button type="button" className="meal-arrow" aria-label="다음날" onClick={() => onChange(1)}>
        ›
      </button>
      <button type="button" className="meal-today" onClick={onToday}>
        오늘
      </button>
    </div>
  );
}

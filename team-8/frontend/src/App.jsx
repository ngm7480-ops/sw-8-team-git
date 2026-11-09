import { useEffect, useState } from "react";

const VIEWS = [
  { id: "home", label: "홈" },
  { id: "meal", label: "급식" },
  { id: "timetable", label: "시간표" },
  { id: "calendar", label: "일정표" },
  { id: "memo", label: "메모" },
  { id: "contest", label: "대회 신청" },
];

const MEAL_DAYS = [
  {
    label: "월",
    date: "10.19",
    fullDate: "10월 19일 월요일",
    meals: ["조식", "중식", "석식"],
    menu: [
      ["🍚", "현미밥", "곡류"],
      ["🍲", "소고기뭇국", "국/탕"],
      ["🍗", "간장 닭볶음", "메인 메뉴"],
      ["🥗", "시금치나물", "채소"],
      ["🥬", "배추김치", "김치"],
      ["🍊", "귤", "후식"],
    ],
    nutrition: { calories: 785, carbs: 105, protein: 35 },
    note: "새로운 한 주의 시작! 천천히 꼭꼭 씹어 먹어요.",
  },
  {
    label: "화",
    date: "10.20",
    fullDate: "10월 20일 화요일",
    meals: ["조식", "중식", "석식"],
    menu: [
      ["🍚", "흑미밥", "곡류"],
      ["🥣", "된장찌개", "국/탕"],
      ["🐟", "고등어구이", "메인 메뉴"],
      ["🥚", "계란찜", "반찬"],
      ["🥬", "깍두기", "김치"],
      ["🍎", "사과", "후식"],
    ],
    nutrition: { calories: 810, carbs: 110, protein: 34 },
    note: "생선과 채소도 함께 먹으면 더 든든해요.",
  },
  {
    label: "수",
    date: "10.21",
    fullDate: "10월 21일 수요일",
    meals: ["조식", "중식", "석식"],
    menu: [
      ["🍝", "토마토 스파게티", "면류"],
      ["🍞", "마늘빵", "빵류"],
      ["🍗", "치킨너겟", "메인 메뉴"],
      ["🥗", "그린 샐러드", "채소"],
      ["🥒", "오이피클", "반찬"],
      ["🥛", "우유", "음료"],
    ],
    nutrition: { calories: 920, carbs: 124, protein: 37 },
    note: "오늘은 색다른 메뉴! 채소도 곁들여 먹어요.",
  },
  {
    label: "목",
    date: "10.22",
    fullDate: "10월 22일 목요일",
    meals: ["조식", "중식", "석식"],
    menu: [
      ["🍚", "보리밥", "곡류"],
      ["🍲", "육개장", "국/탕"],
      ["🥩", "돈육불고기", "메인 메뉴"],
      ["🥦", "브로콜리무침", "채소"],
      ["🥬", "배추김치", "김치"],
      ["🍌", "바나나", "후식"],
    ],
    nutrition: { calories: 860, carbs: 116, protein: 39 },
    note: "든든하게 먹고 오후 수업도 힘내 봐요.",
  },
  {
    label: "금",
    date: "10.23",
    fullDate: "10월 23일 금요일",
    meals: ["조식", "중식", "석식"],
    menu: [
      ["🍛", "카레라이스", "일품요리"],
      ["🍤", "새우튀김", "메인 메뉴"],
      ["🥗", "양배추 샐러드", "채소"],
      ["🥣", "미소장국", "국/탕"],
      ["🥬", "깍두기", "김치"],
      ["🍮", "푸딩", "후식"],
    ],
    nutrition: { calories: 895, carbs: 128, protein: 29 },
    note: "한 주 동안 수고했어요. 즐거운 주말 보내세요!",
  },
  {
    label: "토",
    date: "10.24",
    fullDate: "10월 24일 토요일",
    meals: ["조식"],
    menu: [
      ["🍚", "잡곡밥", "곡류"],
      ["🍲", "콩나물국", "국/탕"],
      ["🍖", "돼지갈비찜", "메인 메뉴"],
      ["🥕", "잡채", "반찬"],
      ["🥬", "배추김치", "김치"],
      ["🍇", "포도", "후식"],
    ],
    nutrition: { calories: 842, carbs: 118, protein: 32 },
    note: "토요일은 조식만 제공됩니다.",
  },
  {
    label: "일",
    date: "10.25",
    fullDate: "10월 25일 일요일",
    meals: [],
    menu: [],
    nutrition: null,
    note: "일요일은 급식이 제공되지 않습니다.",
  },
];

const PLACEHOLDERS = {
  home: {
    title: "홈",
    description: "학교생활에 필요한 소식을 한곳에서 확인하는 화면입니다.",
  },
  timetable: {
    title: "주간 시간표",
    description: "수업 시간은 다음 작업에서 연결할 예정입니다.",
  },
  calendar: {
    title: "학교 일정표",
    description: "행사와 신청 마감일을 다음 작업에서 연결할 예정입니다.",
  },
  memo: {
    title: "메모",
    description: "메모 기능은 다음 작업에서 연결할 예정입니다.",
  },
  contest: {
    title: "대회 신청",
    description: "대회 신청 기능은 다음 작업에서 연결할 예정입니다.",
  },
};

function Header({ activeView, onSelectView, theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="topline">
        <a className="brand" href="#home" onClick={() => onSelectView("home")}>
          <span className="brand-mark" aria-hidden="true">🏫</span>
          <span>우리학교</span>
        </a>
        <nav className="top-nav" aria-label="주요 메뉴">
          {VIEWS.map((view) => (
            <button
              key={view.id}
              className={`top-link${activeView === view.id ? " active" : ""}`}
              type="button"
              aria-current={activeView === view.id ? "page" : undefined}
              onClick={() => onSelectView(view.id)}
            >
              {view.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-btn"
            type="button"
            aria-label={theme === "dark" ? "밝은 테마로 바꾸기" : "어두운 테마로 바꾸기"}
            onClick={onToggleTheme}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <span className="tag">포털 미리보기</span>
        </div>
      </div>
    </header>
  );
}

function MealView() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(5);
  const [selectedMeal, setSelectedMeal] = useState("중식");
  const day = MEAL_DAYS[selectedDayIndex];
  const meal = day.meals.includes(selectedMeal) ? selectedMeal : day.meals[0];
  const hasMeal = day.menu.length > 0;

  return (
    <section className="portal-view" aria-labelledby="meal-heading">
      <div className="section-head meal-section-head">
        <div>
          <h1 id="meal-heading">급식 메뉴</h1>
          <p>날짜와 끼니를 선택해 메뉴를 확인해 보세요.</p>
        </div>
        <div className="meal-controls">
          <div className="week-nav" aria-label="날짜 선택">
            {MEAL_DAYS.map((item, index) => (
              <button
                key={item.label}
                className={`day-btn${selectedDayIndex === index ? " active" : ""}`}
                type="button"
                aria-pressed={selectedDayIndex === index}
                onClick={() => setSelectedDayIndex(index)}
              >
                {item.label} <span className="day-date">{item.date}</span>
              </button>
            ))}
          </div>
          {day.meals.length > 0 && (
            <div className="week-nav meal-type-nav" aria-label="끼니 선택">
              {day.meals.map((item) => (
                <button
                  key={item}
                  className={`day-btn${meal === item ? " active" : ""}`}
                  type="button"
                  aria-pressed={meal === item}
                  onClick={() => setSelectedMeal(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">{day.fullDate}</p>

      <div className="content-grid">
        <section className="card" aria-labelledby="meal-card-heading">
          <div className="card-head">
            <h2 id="meal-card-heading">
              {hasMeal ? `${day.label}요일 ${meal}` : "오늘은 급식이 없습니다"}
            </h2>
            <span>{hasMeal ? `${meal} · 예시 식단` : "일요일 · 급식 없음"}</span>
          </div>
          <div className="meal-body">
            <div className="meal-label">
              {hasMeal ? `🍴 ${meal.toUpperCase()} MENU` : "📅 오늘은 급식이 없어요"}
            </div>
            <div className="menu-list">
              {hasMeal ? day.menu.map(([icon, name, category]) => (
                <div className="menu-item" key={name}>
                  <span className="food-icon" aria-hidden="true">{icon}</span>
                  <span>
                    <strong>{name}</strong>
                    <small>{category}</small>
                  </span>
                </div>
              )) : (
                <div className="empty-state">일요일은 급식이 제공되지 않습니다.</div>
              )}
            </div>
            <div className="nutrition" aria-label="영양 정보">
              <Nutrition label="열량" value={day.nutrition?.calories} unit="kcal" />
              <Nutrition label="탄수화물" value={day.nutrition?.carbs} unit="g" />
              <Nutrition label="단백질" value={day.nutrition?.protein} unit="g" />
            </div>
          </div>
        </section>

        <div className="side-stack">
          <section className="card" aria-labelledby="meal-info-heading">
            <div className="card-head">
              <h2 id="meal-info-heading">급식 정보</h2>
              <span>MEAL INFO</span>
            </div>
            <div className="info-body">
              <div className="info-row"><span>평일 배식</span><strong>조식 · 중식 · 석식</strong></div>
              <div className="info-row"><span>토요일</span><strong>조식만 운영</strong></div>
              <div className="info-row"><span>일요일</span><strong>급식 없음</strong></div>
              <div className="info-row"><span>식단 상태</span><strong>{hasMeal ? "예시 식단" : "미제공"}</strong></div>
              <div className="allergy-wrap">
                <span className="allergy-label">알레르기 유발 식품 예시</span>
                <div className="allergy">
                  <span>① 난류</span><span>⑤ 대두</span><span>⑥ 밀</span>
                  <span>⑨ 새우</span><span>⑮ 돼지고기</span>
                </div>
              </div>
            </div>
          </section>
          <aside className="lunch-note">
            <strong>🌱 맛있게 먹어요!</strong>
            <span>{day.note} 실제 알레르기 정보는 학교 공지와 공식 식단표를 확인하세요.</span>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Nutrition({ label, value, unit }) {
  return (
    <div className="nutri">
      <small>{label}</small>
      <strong>{value ?? "-"} <span>{unit}</span></strong>
    </div>
  );
}

function PlaceholderView({ view }) {
  const content = PLACEHOLDERS[view];

  return (
    <section className="portal-view" aria-labelledby="placeholder-heading">
      <div className="section-head">
        <div>
          <h1 id="placeholder-heading">{content.title}</h1>
          <p>{content.description}</p>
        </div>
      </div>
      <section className="card placeholder-card">
        <span className="placeholder-icon" aria-hidden="true">✦</span>
        <h2>{content.title} 화면을 준비하고 있어요</h2>
        <p>현재 Spec 1에서는 급식 화면과 메뉴 이동을 먼저 구현합니다.</p>
      </section>
    </section>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("meal");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    return () => {
      document.documentElement.style.removeProperty("color-scheme");
    };
  }, [theme]);

  const activeLabel = VIEWS.find((view) => view.id === activeView)?.label;

  return (
    <div className="app">
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")}
      />
      <main>
        {activeView === "meal" ? <MealView /> : <PlaceholderView view={activeView} />}
      </main>
      <footer>
        <span>우리학교 · 학교생활 통합 포털 미리보기</span>
        <span>{activeLabel} · UI Spec 1</span>
      </footer>
    </div>
  );
}

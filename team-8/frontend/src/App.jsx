import { useEffect, useState } from "react";
import MealView from "./components/MealView.jsx";

const VIEWS = [
  { id: "home", label: "홈" },
  { id: "meal", label: "급식" },
  { id: "timetable", label: "시간표" },
  { id: "calendar", label: "일정표" },
  { id: "memo", label: "메모" },
  { id: "contest", label: "대회 신청" },
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
        <button className="brand" type="button" onClick={() => onSelectView("home")}>
          <span className="brand-mark" aria-hidden="true">🏫</span>
          <span>우리학교</span>
        </button>
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

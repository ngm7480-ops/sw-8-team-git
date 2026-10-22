import { useState } from "react";

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());

export default function App() {
  const [date, setDate] = useState(today);
  const [result, setResult] = useState("버튼을 눌러 연결을 확인하세요.");
  const [loading, setLoading] = useState(false);

  async function check(path) {
    setLoading(true);
    setResult("요청 중...");
    try {
      const response = await fetch(path);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? `HTTP ${response.status}`);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`요청 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 860, margin: "64px auto", padding: "0 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1>8팀 로컬 개발 환경</h1>
      <p>React → Spring Boot → MySQL / 나이스 급식 API</p>
      <p>경북소프트웨어마이스터고등학교의 급식을 백엔드에서 조회합니다.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button disabled={loading} onClick={() => check("/health")}>백엔드 확인</button>
        <button disabled={loading} onClick={() => check("/health/db")}>MySQL 확인</button>
        <label>급식 날짜 <input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <button disabled={loading || !date} onClick={() => check(`/api/meals?date=${encodeURIComponent(date)}`)}>외부 API 호출</button>
      </div>
      <pre aria-live="polite" style={{ marginTop: 24, padding: 20, background: "#f2f4f7", borderRadius: 8, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{result}</pre>
    </main>
  );
}

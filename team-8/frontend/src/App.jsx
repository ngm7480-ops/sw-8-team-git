import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function App() {
  const [message, setMessage] = useState("연결을 확인해보세요.");

  const checkConnection = async () => {
    setMessage("확인 중...");

    try {
      const response = await fetch(`${API_URL}/health/db`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
    } catch {
      setMessage("연결에 실패했습니다. Docker와 Backend 로그를 확인하세요.");
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "80px auto", padding: "0 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1>React → Spring Boot → MySQL</h1>
      <p>{message}</p>
      <button onClick={checkConnection} style={{ padding: "10px 16px", font: "inherit", cursor: "pointer" }}>
        연결 확인
      </button>
    </main>
  );
}

import { useEffect, useState } from "react";
import DateNav from "./DateNav.jsx";
import MealCard from "./MealCard.jsx";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import "./meal.css";

const ORDER = ["조식", "중식", "석식"];

function todayInSeoul() {
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const parts = Object.fromEntries(
    dateParts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function shift(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d + days));
  const p = (n) => String(n).padStart(2, "0");
  return `${shifted.getUTCFullYear()}-${p(shifted.getUTCMonth() + 1)}-${p(shifted.getUTCDate())}`;
}

function sortMeals(meals) {
  const rank = (t) => {
    const i = ORDER.indexOf(t);
    return i === -1 ? ORDER.length : i;
  };
  return [...meals].sort((a, b) => rank(a.type) - rank(b.type));
}

export default function MealView() {
  const [date, setDate] = useState(todayInSeoul);
  const [status, setStatus] = useState("loading"); // loading | error | empty | data
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Cleanup aborts the previous request, so stale responses are ignored.
    const controller = new AbortController();
    setStatus("loading");
    setError("");

    (async () => {
      try {
        const res = await fetch(`/api/meals?date=${encodeURIComponent(date)}`, {
          signal: controller.signal,
        });
        let body = null;
        try {
          body = await res.json();
        } catch {
          body = null;
        }
        if (controller.signal.aborted) return;
        if (!res.ok) {
          setError(body?.message || `급식 정보를 불러오지 못했습니다. (${res.status})`);
          setStatus("error");
          return;
        }
        const meals = Array.isArray(body?.meals) ? body.meals : null;
        if (!meals) {
          setError("서버 응답 형식이 올바르지 않습니다.");
          setStatus("error");
          return;
        }
        setData({ ...body, meals: sortMeals(meals) });
        setStatus(meals.length === 0 ? "empty" : "data");
      } catch (e) {
        if (e?.name === "AbortError" || controller.signal.aborted) return;
        setError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.");
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [date, reloadKey]);

  const loading = status === "loading";
  const onNav = (v) => setDate((d) => (typeof v === "number" ? shift(d, v) : v));

  return (
    <section className="meal-view">
      <div className="meal-head">
        <h2>🍽️ 급식</h2>
        <DateNav date={date} onChange={onNav} onToday={() => setDate(todayInSeoul())} />
      </div>
      {data?.school && (status === "data" || status === "empty") && <p className="meal-school">{data.school}</p>}
      {loading && <LoadingState />}
      {status === "error" && <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />}
      {status === "empty" && <EmptyState date={date} />}
      {status === "data" && (
        <div className="meal-grid">
          {data.meals.map((meal) => (
            <MealCard key={meal.type} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
}

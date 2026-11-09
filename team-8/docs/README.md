# 8팀 Spec 문서

급식 중심 학교생활 포털을 만들기 위한 단계별 Spec. 번호 순서대로 진행하며, 각 Spec은 독립적으로 완료 여부를 판단할 수 있다.

| # | Spec | 한 줄 요약 | 선행 |
|---|------|-----------|------|
| 0 | [예시 코드 가져오기](00-example-code.md) | `lecture_sample` 브랜치를 fetch/switch로 확인 | - |
| 1 | [UI 접근 환경](01-ui-environment.md) | React + Vite로 기존 HTML UI를 띄운다 | 0 |
| 2-A | [프론트 API 호출](02a-frontend-api-call.md) | 버튼 클릭 → fetch → 응답/오류 표시 | 1 |
| 2-B | [백엔드 API 응답](02b-backend-api.md) | Spring Controller가 고정 JSON 반환 | 0 |
| 3 | [외부 API 연동](03-external-api.md) | NEIS 급식 API 호출·가공 후 반환 | 2-B |
| 4 | [데이터 시각화 UI](04-frontend-visualization.md) | 실제 데이터를 카드 UI로 표시 | 2-A, 3 |

2-A와 2-B는 [API 계약](api-contract.md)만 합의하면 병렬 작업이 가능하다.

```text
0 ─► 1 ─► 2-A ──────┐
 └────► 2-B ─► 3 ──┴─► 4
```

## 공통 원칙

- 프론트·백엔드 사이의 약속은 [api-contract.md](api-contract.md)가 기준이다. 바꾸면 양쪽 Spec을 함께 고친다.
- 각 Spec의 "완료 조건"을 모두 만족해야 다음 단계로 넘어간다.
- API 키(`API_KEY`)는 `.env`에만 두고 커밋하지 않으며, 프론트로 노출하지 않는다.
- 작업은 기능 단위 브랜치에서 하고, 예시 브랜치(`lecture_sample`)는 참고만 한다.

## 현재 코드 상태 (2026-11-09 기준)

- `team-8/frontend`: Vite + React 19. `src/App.jsx`는 연결 확인용 화면, 기존 HTML 시안은 `src/index.html` · `style.css` · `script.js`로 분리돼 있음(아직 React 미적용).
- `team-8/backend`: Spring Boot, `HealthController`(`/health`, `/health/db`)만 있음. 패키지 `com.example.dockerpractice`.
- `lecture_sample` 브랜치: 패키지 `com.teameight`, `MealController`·`NeisMealService`·`ApiExceptionHandler` 및 테스트 포함.

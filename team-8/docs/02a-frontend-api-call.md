# Spec 2-A. 프론트엔드 API 호출 구현

## 목표
버튼 클릭으로 백엔드 API를 호출하고, 응답과 오류를 화면에 표시한다.

## 선행
Spec 1 완료. 계약은 [api-contract.md](api-contract.md). 백엔드(2-B)가 아직 없어도 오류 표시 경로까지 검증할 수 있다.

## 범위
- 포함: 이벤트 핸들러, fetch, loading/error/data 상태, Vite proxy
- 제외: 카드 UI 등 시각 디자인(Spec 4) — 여기서는 JSON 또는 간단한 텍스트 출력이면 충분

## 설계
| 항목 | 값 |
|------|----|
| UI 요소 | 급식 화면의 "급식 불러오기" 버튼 (+ 날짜 input) |
| 요청 | `GET /api/meals?date=YYYY-MM-DD` |
| 상태 | `data`, `loading`, `error` |

## 작업
1. `vite.config.js`에 `server.proxy`로 `/api`, `/health` → `http://localhost:8080` 설정 (예시 브랜치 참고)
2. 버튼에 `onClick` 연결
3. `fetch("/api/meals?date=...")` 구현
   - `!response.ok`면 본문의 `message`로 오류 처리
   - 네트워크 실패(서버 꺼짐)도 `catch`로 처리
   - `finally`에서 loading 해제, 요청 중 버튼 비활성화
4. 개발자 도구 Network 탭에서 요청 URL·상태코드·응답 JSON 확인
5. 성공 시 응답을 화면에 표시, 실패 시 오류 메시지 표시

## 완료 조건
- [ ] 버튼 클릭 시 Network 탭에 `/api/meals` 요청이 보인다
- [ ] 로딩 중 "불러오는 중…"이 표시되고 버튼이 비활성화된다
- [ ] 백엔드가 꺼진 상태에서 오류 메시지가 화면에 표시된다
- [ ] 백엔드가 켜진 상태(2-B)에서 응답 데이터가 화면에 표시된다
- [ ] 400/502 응답의 `message`가 화면에 표시된다

## 비고
- 2-A는 2-B와 병렬 진행 가능하다. 백엔드 완료 전에는 오류 경로만 확인한다.

# Spec 2-B. 백엔드 API 응답 구현

## 목표
Spring Boot에서 `GET /api/meals` 요청을 받아 고정된 JSON을 반환하는 Controller를 만든다.

## 선행
Spec 0(예시 확인). 계약은 [api-contract.md](api-contract.md).

## 현재 상태
- `team-8/backend`: `HealthController`만 존재, 패키지 `com.example.dockerpractice`
- MySQL 연동과 `@CrossOrigin(origins="http://localhost:5173")`가 Health 컨트롤러에 있음
- 예시(`lecture_sample`)는 `MealController`가 `/api/meals`를 제공 — 구조만 참고하고 이 단계에서는 외부 호출 없이 고정값을 반환

## 범위
- 포함: Controller, 고정 JSON, 직접 호출 확인, 로그 확인
- 제외: 외부 API 호출(Spec 3), DB 저장

## 작업
1. 실행 방법 확인: `docker compose up -d --build` 후 `docker compose logs backend`로 기동 확인
2. 프론트가 정의한 Method/Endpoint 확인: `GET /api/meals`
3. `MealController` 작성
   - `@RestController`, `@GetMapping("/api/meals")`
   - 선택 파라미터 `date`(없으면 오늘), 받은 값을 응답의 `date`에 반영
   - 계약의 응답 형식에 맞춘 고정 데이터 반환(조식/중식/석식 샘플)
4. Vite proxy 사용 시 CORS는 불필요. proxy 없이 호출한다면 `/api/**`에 CORS 허용 추가
5. 브라우저 `http://localhost:8080/api/meals` 또는 `curl`로 호출해 응답 확인
6. 서버 로그에서 요청 처리 확인
7. 프론트(2-A)에서 호출해 응답 전달 확인

## 완료 조건
- [ ] `curl localhost:8080/api/meals`가 계약 형식의 JSON을 200으로 반환
- [ ] `?date=2026-11-09`를 주면 응답의 `date`가 해당 값
- [ ] 잘못된 date(`?date=abc`)는 400 + `message` (예시의 `ApiExceptionHandler` 참고)
- [ ] 서버 로그로 요청을 확인했다
- [ ] 프론트 버튼 클릭 시 응답이 화면에 도달한다
- [ ] (권장) `MockMvc` 테스트 1개: 200과 JSON 필드 검증

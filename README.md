# 8팀 — Docker 기반 로컬 개발 환경

React + Java 21 / Spring Boot 4.1.1 + MySQL 8.4를 Docker Compose로 실행한다.
기존 멘토링 저장소의 `practice/team-8` 구성을 바탕으로 나이스 급식 API 호출을 추가했다.
프런트엔드와 백엔드 빌드 모두 Docker 안에서 수행하므로 PC에 Java, Maven, Node.js를 따로 설치할 필요가 없다.

```text
Browser (http://localhost:5173)
  → React / Vite (Docker)
  → Vite proxy → Spring Boot (Docker, backend:8080)
                    ├→ MySQL (Docker, mysql:3306)
                    └→ HTTPS → 나이스 급식 API
```

## 실행

Docker Desktop을 실행한 뒤 PowerShell에서 진행한다.

```powershell
cd C:\GIT\team-eight

# .env가 없을 때만 복사한다. 기존 .env를 덮어쓰지 않는다.
if (!(Test-Path .env)) { Copy-Item .env.example .env }

docker compose up -d --build --wait
docker compose ps
```

현재 작업 PC에는 기존 `practice/team-8/.env`를 복사해 두었다.
`.env`는 Git에서 제외하며 `.env.example`에는 실제 인증키를 넣지 않는다.
처음 빌드할 때는 이미지와 의존성 다운로드 때문에 시간이 걸릴 수 있다.

브라우저에서 **http://localhost:5173** 에 접속한다.

- **백엔드 확인**: Spring Boot 응답 확인
- **MySQL 확인**: 백엔드에서 MySQL에 `SELECT 1` 실행
- **외부 API 호출**: 선택한 날짜의 나이스 급식 정보를 백엔드에서 조회

## API 확인

| 경로 | 동작 |
| --- | --- |
| `GET http://localhost:8080/health` | Spring Boot 실행 확인 |
| `GET http://localhost:8080/health/db` | MySQL 연결 확인, 실패 시 HTTP 503 |
| `GET http://localhost:8080/api/meals?date=2026-10-22` | 날짜별 나이스 급식 API 호출 |
| `GET http://localhost:8080/api/meals` | 한국 시간 기준 오늘 급식 조회 |

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/health/db
Invoke-RestMethod 'http://localhost:8080/api/meals?date=2026-10-22' | ConvertTo-Json -Depth 10
```

급식 데이터는 나이스 응답 JSON을 그대로 반환한다. 급식이 없는 날짜의 `INFO-200`은 정상 응답이다.
잘못된 날짜는 HTTP 400, 외부 API의 인증 오류·연결 오류·시간 초과는 HTTP 502로 반환한다.
연결 제한 시간은 기본 3초, 응답 제한 시간은 기본 10초다.
나이스 게이트웨이 호환을 위해 `Accept: */*`와 `Type=json`을 사용한다.

## 환경변수

모든 설정은 루트 `.env`에 작성하며 Docker Compose가 컨테이너에 전달한다.
Spring Boot가 `.env` 파일을 직접 읽는 방식은 아니다.

| 변수 | 용도 / 기본값 |
| --- | --- |
| `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` | MySQL 초기 설정, 필수 |
| `BACKEND_PORT` | PC에서 접근할 백엔드 포트, `8080` |
| `FRONTEND_PORT` | 브라우저 접속 포트, `5173` |
| `MYSQL_PORT` | PC DB 도구에서 접근할 포트, `13306` |
| `API_ENDPOINT` | `https://open.neis.go.kr/hub/mealServiceDietInfo` |
| `API_KEY` | 나이스 인증키. 비워두면 공개 샘플 모드 사용 |
| `NEIS_OFFICE_CODE` | 교육청 코드, `R10` |
| `NEIS_SCHOOL_CODE` | 학교 코드, `8750829` (경북소프트웨어마이스터고등학교) |
| `API_CONNECT_TIMEOUT`, `API_READ_TIMEOUT` | 외부 API 제한 시간, `3s` / `10s` |

API 키는 백엔드에만 전달한다. 프런트엔드에 `VITE_API_KEY` 등으로 넣지 않는다.
학교·날짜·인증키를 API 규격에 맞는 쿼리 파라미터로 보내며 한 번에 최대 5건을 조회한다.

포트가 충돌하면 `.env`의 해당 포트를 바꾼 뒤 다시 실행한다.
컨테이너 사이에서는 호스트 포트와 관계없이 `backend:8080`, `mysql:3306`을 사용한다.
PC의 DB 도구에서는 `127.0.0.1:13306`과 `.env`의 DB명·사용자·비밀번호를 사용한다.

## 수정 및 로그

React `frontend/src` 수정은 실행 중인 컨테이너에 반영된다.
Java 소스나 백엔드 의존성을 수정했으면 백엔드를 다시 빌드한다.

```powershell
docker compose up -d --build --wait backend

# 프런트엔드 의존성 또는 Vite 설정 수정 후
docker compose up -d --build --wait frontend

docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

`.env`를 수정했다면 `docker compose up -d --wait`로 컨테이너를 다시 생성한다.
`docker compose restart`만으로는 바뀐 환경변수가 적용되지 않는다.
MySQL 계정 설정은 볼륨을 처음 초기화할 때 적용되므로 기존 DB의 계정 변경에는 별도 SQL 작업이 필요하다.

## 테스트

실제 외부 API를 호출하지 않는 모의 HTTP 테스트로 요청 파라미터, 인증 오류, 연결 실패, 날짜 검증을 확인한다.
Docker에서 테스트만 실행하려면:

```powershell
docker run --rm --mount "type=bind,source=$((Get-Location).Path)\backend,target=/app" --workdir /app maven:3.9-eclipse-temurin-21 mvn test
```

## 종료

```powershell
docker compose down
```

MySQL 데이터는 `mysql-data` 볼륨에 유지된다.
데이터를 삭제하고 처음부터 시작할 때만 `docker compose down -v`를 사용한다.

## 주요 파일

```text
team-eight/
├── .env.example
├── compose.yaml
├── frontend/
│   ├── Dockerfile
│   ├── vite.config.js
│   └── src/App.jsx
└── backend/
    ├── Dockerfile
    ├── pom.xml
    └── src/
        ├── main/java/com/teameight/
        │   ├── TeamEightApplication.java
        │   ├── HealthController.java
        │   ├── MealController.java
        │   └── NeisMealService.java
        ├── main/resources/application.properties
        └── test/java/com/teameight/
```

참고: [Spring Boot 외부 REST 호출](https://docs.spring.io/spring-boot/reference/io/rest-client.html), [나이스 교육정보 개방 포털](https://open.neis.go.kr/).

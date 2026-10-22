# 8팀 개발 환경 안내

여러분이 같은 환경에서 개발할 수 있도록 React, Spring Boot, MySQL을 Docker로 실행하는 구성을 준비했습니다.
아래 순서대로 실행하고, Spring Boot를 통해 나이스 급식 API까지 호출되는지 확인해 주세요.
Windows PowerShell과 macOS 터미널(zsh/bash) 명령어를 구분해 안내합니다.
Docker 명령어는 두 운영체제에서 동일합니다. 모든 파일은 UTF-8로 작성해 주세요.

## 1. 기본 세팅

Git과 Docker Desktop을 설치하고, Docker Desktop을 실행해 주세요.
Java, Maven, Node.js는 Docker 이미지 안에서 사용하므로 PC에 별도로 설치하지 않아도 됩니다.

저장소를 받은 폴더에서 다음 명령을 실행합니다. 저장 위치가 다르면 경로를 바꿔 주세요.

**Windows PowerShell**

```powershell
cd C:\GIT\team-eight
docker info
docker compose version

# .env가 없는 경우에만 예시 파일을 복사합니다.
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

**macOS 터미널**

아래는 저장소를 `~/GIT/team-eight`에 받은 경우의 예시입니다.

```bash
cd ~/GIT/team-eight
docker info
docker compose version

# .env가 없는 경우에만 예시 파일을 복사합니다.
if [ ! -f .env ]; then
  cp .env.example .env
fi
```

`docker info`에서 서버 연결 오류가 발생하면 Docker Desktop이 실행됐는지 먼저 확인해 주세요.

## 2. 외부 API 환경변수 설정

환경변수 샘플 파일은 루트의 **`.env.example`**입니다.
외부 API 호출에 필요한 아래 항목을 적어 두었습니다. 실제로 사용할 값은 복사한 **`.env`**에 작성해 주세요.

```dotenv
API_ENDPOINT=https://open.neis.go.kr/hub/mealServiceDietInfo
API_KEY=
NEIS_OFFICE_CODE=R10
NEIS_SCHOOL_CODE=8750829
API_CONNECT_TIMEOUT=3s
API_READ_TIMEOUT=10s
```

| 항목 | 의미 |
| --- | --- |
| `API_ENDPOINT` | 백엔드가 호출할 나이스 급식 API 주소 |
| `API_KEY` | 발급받은 나이스 인증키. `.env`의 `=` 뒤에 입력 |
| `NEIS_OFFICE_CODE` | 교육청 코드. `R10`은 경상북도교육청 |
| `NEIS_SCHOOL_CODE` | 학교 코드. `8750829`는 경북소프트웨어마이스터고등학교 |
| `API_CONNECT_TIMEOUT` | 외부 API 서버 연결을 기다리는 시간. 기본 3초 |
| `API_READ_TIMEOUT` | 외부 API 응답을 기다리는 시간. 기본 10초 |

`API_KEY`를 비워두면 공개 샘플 모드로 요청합니다. 현재 코드는 한 번에 최대 5건을 조회합니다.
실제 인증키는 `.env`에만 입력하고, `.env.example`이나 프런트엔드 코드에는 넣지 마세요.
`.env`는 Git에서 제외하도록 설정했습니다.

설정은 **`.env` → Docker Compose → Spring Boot 컨테이너의 환경변수** 순서로 전달됩니다.
현재 API 처리 코드는 나이스 급식 API 규격에 맞춰져 있습니다. 다른 API를 연동할 때는 주소뿐 아니라 요청·응답 처리 코드도 수정해야 합니다.

## 3. Docker 실행

프로젝트 루트에서 실행합니다. Windows와 macOS 모두 같은 명령어를 사용합니다.
처음에는 이미지와 의존성을 내려받아 시간이 걸릴 수 있습니다.

```shell
docker compose up -d --build --wait
docker compose ps
```

| 서비스 | PC에서 접속하는 주소 |
| --- | --- |
| React 화면 | http://localhost:5173 |
| Spring Boot | http://localhost:8080 |
| MySQL | `127.0.0.1:13306` |

포트 충돌이 발생하면 `.env`의 `FRONTEND_PORT`, `BACKEND_PORT`, `MYSQL_PORT`를 변경하고 다시 실행해 주세요.
포트를 바꿨다면 아래 확인 명령의 주소도 바꿔 주세요.

## 4. Spring Boot를 통해 API 호출하기

PC에서 보내는 요청을 Docker 안의 Spring Boot가 받아 처리합니다.
급식 조회 시에는 Spring Boot가 `.env`의 설정을 사용해 외부 나이스 API를 호출하고 JSON을 반환합니다.

```text
PowerShell / macOS 터미널 / 브라우저 → localhost:8080 → Docker의 Spring Boot → 나이스 API
```

다음 명령을 순서대로 실행해 주세요.

**Windows PowerShell**

```powershell
# 1) Spring Boot 실행 확인: Spring Boot is running
Invoke-RestMethod 'http://localhost:8080/health'

# 2) Spring Boot → MySQL 연결 확인: MySQL connected
Invoke-RestMethod 'http://localhost:8080/health/db'

# 3) Spring Boot → 나이스 API 호출: 날짜별 급식 JSON 확인
Invoke-RestMethod 'http://localhost:8080/api/meals?date=2026-10-22' | ConvertTo-Json -Depth 10

# 4) 날짜를 생략하면 한국 시간 기준 오늘 급식을 조회합니다.
Invoke-RestMethod 'http://localhost:8080/api/meals' | ConvertTo-Json -Depth 10
```

`curl`을 사용하고 싶다면 PowerShell에서는 `curl.exe`로 실행해 주세요.

```powershell
curl.exe 'http://localhost:8080/api/meals?date=2026-10-22'
```

**macOS 터미널**

macOS에서는 `curl`을 사용합니다. 날짜가 포함된 URL은 따옴표로 감싸 주세요.

```bash
# 1) Spring Boot 실행 확인: Spring Boot is running
curl -sS 'http://localhost:8080/health'

# 2) Spring Boot → MySQL 연결 확인: MySQL connected
curl -sS 'http://localhost:8080/health/db'

# 3) Spring Boot → 나이스 API 호출: 날짜별 급식 JSON 확인
curl -sS 'http://localhost:8080/api/meals?date=2026-10-22'

# 4) 날짜를 생략하면 한국 시간 기준 오늘 급식을 조회합니다.
curl -sS 'http://localhost:8080/api/meals'
```

**Windows / macOS 공통: 컨테이너 내부에서 호출**

컨테이너 안에서 Spring Boot에 직접 요청하는 명령도 사용할 수 있습니다.
아래 `wget`은 Docker 컨테이너 안에서 실행되므로 PC에 설치할 필요가 없습니다.

```shell
docker compose exec -T backend wget -qO- 'http://127.0.0.1:8080/api/meals?date=2026-10-22'
```

브라우저에서는 http://localhost:5173 에 접속해 **백엔드 확인**, **MySQL 확인**, **외부 API 호출** 버튼으로 확인할 수 있습니다.

급식이 없는 날짜의 `INFO-200`은 정상 응답입니다. 날짜는 `YYYY-MM-DD`로 입력하며, 잘못된 날짜는 HTTP 400으로 반환합니다.
외부 API의 인증 오류나 연결 실패는 HTTP 502로 반환하므로 `.env` 설정과 백엔드 로그를 확인해 주세요.

## 5. 수정 후 반영 및 종료

아래 Docker 명령어는 Windows와 macOS에서 동일합니다. 프로젝트 루트에서 실행해 주세요.

Java 코드나 백엔드 의존성을 수정했다면 다시 빌드합니다.

```shell
docker compose up -d --build --wait backend
```

외부 API 관련 `.env` 설정을 수정했다면 컨테이너를 다시 생성해 적용합니다.
`docker compose restart`만으로는 변경된 환경변수가 적용되지 않습니다.

```shell
docker compose up -d --wait backend
```

React의 `frontend/src` 수정은 실행 중인 화면에 반영됩니다.
문제가 생기면 로그를 확인하고, 확인을 마치면 종료해 주세요.

```shell
docker compose logs --tail 100 backend
docker compose logs --tail 100 mysql
docker compose down
```

`docker compose down`으로 종료해도 MySQL 데이터는 유지됩니다.

## 코드 확인 포인트

- `compose.yaml`: 컨테이너 실행, 포트 연결, 환경변수 전달
- `backend/src/main/java/com/teameight/HealthController.java`: 서버·DB 연결 확인
- `backend/src/main/java/com/teameight/MealController.java`: `/api/meals` 요청과 날짜 처리
- `backend/src/main/java/com/teameight/NeisMealService.java`: 나이스 요청 파라미터 구성과 외부 API 호출

나이스 호출은 `Accept: */*` 헤더와 `Type=json` 파라미터를 사용합니다.
현재 환경에서 `Accept: application/json`을 보내면 나이스 서버가 HTTP 500을 반환하는 것을 확인해 이 설정을 적용했습니다.

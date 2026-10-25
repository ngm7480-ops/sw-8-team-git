# 8팀 — Docker 로컬 개발환경

기술 스택:

- Frontend: React, JavaScript
- Backend: Java, Spring Boot
- Database: MySQL

## 전체 구조

```text
Browser
  ↓
React (localhost:5173)
  ↓ HTTP
Spring Boot (Docker, localhost:8080)
  ↓
MySQL (Docker, mysql:3306)
```

이 문서 하나를 위에서 아래로 따라가면 된다.

## 1. 준비 확인

필요한 도구:

- VS Code
- Node.js
- Java JDK 21 (로컬에서 Spring Boot를 직접 실행하거나 코드를 확인할 때 사용)
- Docker Desktop
- Git

```bash
node --version
npm --version
java --version    # 선택: Docker 실행만 확인할 때는 없어도 된다.
git --version
docker --version
docker compose version
```

<img width="390" height="343" alt="버전 확인 결과" src="https://github.com/user-attachments/assets/a82dfbb4-34da-4ffd-95d6-111a0e7d917c" />

Windows에서 WSL을 사용하는 경우 다음도 확인한다.

```powershell
wsl --version
```

<img width="477" height="163" alt="WSL 버전 확인" src="https://github.com/user-attachments/assets/9cbf0cc9-492a-4a78-9cb4-0552397bff56" />

Docker Engine 확인:

```bash
docker run hello-world
```

<img width="596" height="172" alt="Docker hello-world 실행 결과" src="https://github.com/user-attachments/assets/12fa6526-440f-41dd-9a35-2cdd73dc624d" />


## 2. 환경변수 준비

`.env.example`을 복사해 `.env`를 만든다.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS / Linux / Git Bash:

```bash
cp .env.example .env
```

## 3. Frontend 준비

```bash
cd frontend
npm install
npm run dev
```

브라우저:

```text
http://localhost:5173
```

현재 화면의 연결 확인 버튼은 Backend가 실행되기 전에는 실패하는 것이 정상이다.


### React 프로젝트 생성 참고

이 저장소에는 `frontend/`가 이미 준비되어 있으므로 새로 만들 필요는 없다. 새 React 프로젝트를 만들 때는 Vite를 사용할 수 있다.

```bash
npm create vite@latest frontend -- --template react
```

<img width="942" height="727" alt="Vite React 프로젝트 생성" src="https://github.com/user-attachments/assets/c51beadd-13a7-4f4a-ba84-6b060ef81ed2" />

Vite 개발 서버가 정상적으로 실행되면 다음과 같은 초기 화면을 확인할 수 있다.

<img width="1334" height="769" alt="Vite React 초기 화면" src="https://github.com/user-attachments/assets/3a9e0216-0471-4c26-96ec-c895507922bf" />


Frontend를 확인했으면 `Ctrl + C`로 종료하고 팀 디렉터리로 돌아온다.

## 4. Backend 코드 확인

Spring Boot 프로젝트는 `backend/`에 준비되어 있다.

두 API를 확인한다.

```text
GET /health
→ Spring Boot 실행 확인

GET /health/db
→ Spring Boot에서 MySQL 연결 확인
```

주요 파일:

```text
team-8/
├── .env.example              # MySQL 환경변수 예시
├── compose.yaml              # Spring Boot + MySQL 실행
├── frontend/
│   ├── package.json
│   └── src/
│       └── App.jsx            # Backend 연결 확인 화면
└── backend/
    ├── pom.xml                # Spring Boot dependency와 build 설정
    ├── Dockerfile             # Spring Boot Image 생성
    └── src/main/
        ├── java/.../
        │   ├── DockerPracticeApplication.java
        │   └── HealthController.java
        └── resources/
            └── application.properties
```

실습에 필요한 완성 파일은 모두 이 `team-8/` 디렉터리에 들어 있다. 별도의 예제 파일을 다른 경로에서 복사할 필요는 없다.

## 5. Backend Image 확인

```bash
docker build -t practice-team8-backend ./backend
docker images
```
<img width="822" height="143" alt="image" src="https://github.com/user-attachments/assets/884cad0b-68c6-4694-9a83-87910282ffbf" />

Spring Boot만 실행해본다.

```bash
docker run --rm -p 8080:8080 practice-team8-backend
```
<img width="837" height="445" alt="image" src="https://github.com/user-attachments/assets/2b997561-2e8d-478c-8986-925290a554f2" />

브라우저:

```text
http://localhost:8080/health
```

정상 응답:

```json
{
  "message": "Spring Boot is running"
}
```
<img width="375" height="144" alt="image" src="https://github.com/user-attachments/assets/bf8887d3-b429-482a-bfaa-12ee766db07a" />

확인 후 `Ctrl + C`로 종료한다.

## 6. Backend와 MySQL 실행

```bash
docker compose up -d --build
docker compose ps
```
(env.example 복사해서 env 만들고, 포트충돌도 확인해볼것.)
<img width="813" height="372" alt="image" src="https://github.com/user-attachments/assets/aa357649-56a0-4782-803e-f74454107ec4" />

MySQL 연결 확인:

```text
http://localhost:8080/health/db
```

정상 응답:

```json
{
  "message": "MySQL connected"
}
```
<img width="408" height="140" alt="image" src="https://github.com/user-attachments/assets/b6e9448c-148e-47d4-ab7a-c022f5c5a3ce" />

문제가 있으면:

```bash
docker compose logs
docker compose logs backend
docker compose logs mysql
```

## 7. 전체 연결 확인

새 Terminal에서:

```bash
cd frontend
npm run dev
```

브라우저에서 `http://localhost:5173`에 접속하고 **연결 확인** 버튼을 누른다.

```text
React :5173
↓ HTTP
Spring Boot :8080
↓
MySQL :3306
```
<img width="713" height="301" alt="image" src="https://github.com/user-attachments/assets/3b155f06-8ce6-48ea-80b4-31fbc1ffad9b" />

## 8. 종료

Frontend Terminal:

```text
Ctrl + C
```

Docker:

```bash
docker compose down
```

Database 데이터까지 삭제:

```bash
docker compose down -v
```

## 완료 확인

- [ ] React가 `localhost:5173`에서 실행된다.
- [ ] Spring Boot가 `localhost:8080`에서 실행된다.
- [ ] MySQL Container가 실행된다.
- [ ] `/health/db`에서 MySQL 연결을 확인했다.
- [ ] React에서 전체 연결을 확인했다.
- [ ] `docker compose logs`로 로그를 확인할 수 있다.
- [ ] `docker compose down`으로 종료할 수 있다.

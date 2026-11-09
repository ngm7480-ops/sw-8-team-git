# Spec 1. UI 접근 환경 정상화

## 목표
React + Vite 개발 서버를 실행하고, 브라우저에서 기존 HTML UI(우리학교 포털)가 React로 표시되게 한다.

## 구현 결과 (2026-11-09)
- Vite 진입점을 `frontend/index.html`로 만들고, `#root`에서 `/src/main.jsx`를 불러오도록 연결함
- `src/main.jsx`에서 `style.css`를 import함
- `src/App.jsx`에 상단 메뉴와 화면 전환 상태를 두고, 구현 범위 밖 메뉴는 자리표시자로 표시함
- `src/components/MealView.jsx`를 급식 화면으로 사용함. 후속 작업에서 API 연동이 추가되어 현재 화면은 예시 상수가 아니라 `/api/meals`를 호출함
- 이전 정적 HTML과 DOM 직접 조작 스크립트(`src/index.html`, `src/script.js`)는 React 이전 후 제거함

## 범위
- 포함: 개발 서버 실행, 진입점 정리, HTML → React 컴포넌트 이전 계획 및 1차 이전
- 제외: API 연동(Spec 2 이후), 로그인·시간표·메모 등 급식 외 기능의 동작 구현

## 작업
1. `package.json`, 폴더 구조 확인 및 `npm install`
2. 진입점 정리: `frontend/index.html`에 `<div id="root">`와 `<script type="module" src="/src/main.jsx">` 배치
3. 이전 방식 결정(권장): 급식 화면부터 컴포넌트화
   - `Header`(상단 내비), `MealView`(급식), 나머지 탭은 자리표시자
   - `style.css`는 `main.jsx`에서 import
   - `script.js`의 화면 전환은 `useState`(현재 view)로 대체
   - 예시 급식 데이터는 임시로 상수 유지(Spec 4에서 API 데이터로 교체)
4. `npm run dev` 실행 후 `http://localhost:5173` 접속
5. `Ctrl+C`로 종료 후 재실행을 반복

## 완료 조건
- [x] `npm install`이 오류 없이 끝난다
- [x] Vite 개발 서버가 시작되고 진입 HTML과 React 모듈이 HTTP 200으로 응답한다. 검증 중 `5173`은 사용 중이어서 `5174`를 사용함
- [x] 상단 메뉴 전환을 React state로 처리한다
- [ ] 브라우저 화면과 콘솔 오류를 직접 확인한다
- [x] 개발 서버를 종료할 수 있다
- [x] `npm run build`가 성공한다

브라우저 UI 자동화 대상이 이 세션에 제공되지 않아 화면 클릭과 콘솔 확인은 남아 있다. 코드와 빌드는 확인했다.

## 리스크
- `script.js`를 그대로 `<script>`로 넣으면 React DOM과 충돌하므로 React 이전 후 제거한다
- `.DS_Store` 등 불필요 파일이 커밋되지 않게 `.gitignore`를 확인한다

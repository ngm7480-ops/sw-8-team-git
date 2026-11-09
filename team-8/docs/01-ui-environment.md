# Spec 1. UI 접근 환경 정상화

## 목표
React + Vite 개발 서버를 실행하고, 브라우저에서 기존 HTML UI(우리학교 포털)가 React로 표시되게 한다.

## 현재 상태
- `frontend/package.json`에 react 19, vite 7, plugin-react 설정됨
- Vite는 **프로젝트 루트의 `index.html`**을 진입점으로 쓰는데, 현재 HTML은 `src/index.html`에 있고 `<link href="css/style.css">`, `script.js`를 직접 참조 → 그대로는 동작하지 않음
- `src/main.jsx`는 `#root`를 찾지만 해당 HTML에는 `#root`가 없음
- `script.js`는 DOM을 직접 조작(`getElementById`, `innerHTML`)하는 바닐라 JS

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
- [ ] `npm install`이 오류 없이 끝난다
- [ ] `npm run dev` 후 `localhost:5173`에서 포털 헤더와 급식 화면이 보인다
- [ ] 상단 메뉴 클릭 시 화면이 전환된다(React state)
- [ ] 브라우저 콘솔에 오류가 없다
- [ ] 서버 종료 → 재실행이 문제없다
- [ ] `npm run build`가 성공한다

## 리스크
- `script.js`를 그대로 `<script>`로 넣으면 React DOM과 충돌한다 → 이전 후 삭제
- `.DS_Store` 등 불필요 파일이 커밋되지 않게 `.gitignore` 확인

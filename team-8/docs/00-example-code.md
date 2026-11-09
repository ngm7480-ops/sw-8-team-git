# Spec 0. 예시 코드 가져오기 및 확인

## 목표
원격 `lecture_sample` 브랜치의 예시 코드를 로컬로 가져와 구조를 파악하고, 작업 브랜치에서 참고할 수 있게 한다.

## 범위
- 포함: fetch, 브랜치 전환, 구조 확인, 파일 단위 참고 방법
- 제외: 예시 코드를 그대로 병합(merge)하는 것

## 작업
1. GitHub에서 `lecture_sample` 브랜치 존재 확인
2. `git fetch origin`으로 원격 정보 가져오기, `git branch -r`로 확인
3. `git switch lecture_sample`(없으면 `git switch -c lecture_sample --track origin/lecture_sample`)
4. 폴더 구조·주요 파일 확인

   | 위치 | 확인할 것 |
   |------|-----------|
   | `backend/.../MealController.java` | `/api/meals` 엔드포인트, date 파라미터 |
   | `backend/.../NeisMealService.java` | 외부 API 호출 흐름, 오류 처리 |
   | `backend/.../ApiExceptionHandler.java` | 400/502 응답 |
   | `backend/src/test/` | 테스트 작성 방식 |
   | `backend/src/main/resources/application.properties` | `neis.*` 설정과 환경변수 |
   | `frontend/vite.config.js` | `/api` proxy 설정 |
   | `.env.example`, `compose.yaml` | 필요한 환경변수 |
5. 작업 브랜치로 복귀(`git switch <작업 브랜치>`)하고, 필요한 파일은 `git show lecture_sample:<경로>` 또는 `git restore --source=lecture_sample -- <경로>`로 가져와 참고
6. 전환 → 확인 → 복귀를 2~3회 반복해 익숙해진다

## 완료 조건
- [ ] `git branch -r`에 `origin/lecture_sample`이 보인다
- [ ] 예시 브랜치로 전환해 위 표의 파일을 열어봤다
- [ ] 작업 브랜치로 돌아와 `git status`가 깨끗하다(전환 중 변경 유실 없음)
- [ ] `git show`로 예시 파일 내용을 작업 브랜치에서 볼 수 있다

## 주의
- 전환 전 미커밋 변경은 commit 또는 stash 한다.
- 예시와 `team-8/`의 패키지명(`com.teameight` vs `com.example.dockerpractice`)과 위치가 다르므로 복사 시 맞춰야 한다.

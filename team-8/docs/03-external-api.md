# Spec 3. 외부 API 연동 및 실제 데이터 반환

## 목표
Spring Boot에서 NEIS 급식 API를 호출하고, 필요한 필드만 가공해 계약 형식으로 반환한다. Controller는 고정값 대신 실제 데이터를 사용한다.

## 선행
Spec 2-B. 계약은 [api-contract.md](api-contract.md).

## 외부 API (NEIS 급식식단정보)
| 항목 | 값 |
|------|----|
| URL | `https://open.neis.go.kr/hub/mealServiceDietInfo` |
| Method | GET |
| 파라미터 | `KEY`(인증키), `Type=json`, `pIndex`, `pSize`, `ATPT_OFCDC_SC_CODE`(교육청, 예시 `R10`), `SD_SCHUL_CODE`(학교, 예시 `8750829`), `MLSV_YMD`(`yyyyMMdd`) |
| 주요 응답 필드 | `MMEAL_SC_NM`(조/중/석식), `DDISH_NM`(메뉴, `<br/>` 구분), `CAL_INFO`(칼로리), `NTR_INFO`(영양), `ORPLC_INFO`(원산지), `SCHUL_NM` |
| 급식 없음 | `RESULT.CODE = INFO-200` (정상) |

## 범위
- 포함: 호출, 파싱·변환, Controller 연결, 오류 처리, 설정/키 관리
- 제외: 캐싱, DB 저장 (필요 시 후속 Spec)

## 작업
1. 예시 `NeisMealService`의 흐름 확인(RestClient, 파라미터, `INFO-200` 처리, 예외 변환)
2. 설정: `application.properties`에 `neis.*` 추가, `.env`/`.env.example`에 `API_KEY` 등 추가, `compose.yaml` backend `environment`로 전달
3. 서비스 구현: 호출 → 응답 검증
4. 가공 로직
   - `mealServiceDietInfo[1].row[]`에서 `type`, `menu`, `calories` 추출
   - `DDISH_NM`을 `<br/>`로 분리하고 알레르기 표기 `(1.2.5)` 제거
   - 급식 없음(`INFO-200`)은 `meals: []`로 200 반환
5. Controller가 서비스 결과를 반환하도록 변경(고정값 제거)
6. 오류 처리: 타임아웃/연결 실패/NEIS 오류 코드 → 502 + 일반화된 `message`
7. 프론트에서 호출해 실제 급식 표시 확인

## 완료 조건
- [ ] 급식이 있는 날짜(평일)로 실제 메뉴가 계약 형식으로 반환된다
- [ ] 주말/방학 등 급식 없는 날짜는 `meals: []`, 200
- [ ] 응답에 알레르기 번호와 `<br/>`가 없다
- [ ] 키를 지우거나 잘못된 URL이면 502와 `message`가 반환된다
- [ ] 로그·응답 어디에도 `KEY` 값이 노출되지 않는다
- [ ] 서비스 단위 테스트(정상/없음/오류) 작성, `RestClient`는 목 처리해 키 없이 실행 가능
- [ ] `.env`는 커밋되지 않았다

## 리스크
- NEIS는 `Accept: application/json`에 500을 반환 → 쿼리 `Type=json` 사용, Accept는 `*/*`(예시 코드 주석 참고)
- 인증키 없이도 소량 호출은 가능하나 호출 제한이 있음 → 키 발급 권장
- 예외 메시지에 요청 URL(키 포함)이 담길 수 있어 그대로 노출하면 안 됨

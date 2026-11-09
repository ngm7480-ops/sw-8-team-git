package com.example.dockerpractice;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class NeisMealService {

    private static final Logger log = LoggerFactory.getLogger(NeisMealService.class);

    private final RestClient client;
    private final String endpoint;
    private final String apiKey;
    private final String officeCode;
    private final String schoolCode;
    private final String defaultSchoolName;

    public NeisMealService(RestClient.Builder builder,
            @Value("${neis.endpoint}") String endpoint,
            @Value("${neis.api-key}") String apiKey,
            @Value("${neis.office-code}") String officeCode,
            @Value("${neis.school-code}") String schoolCode,
            @Value("${neis.school-name}") String defaultSchoolName) {
        this.client = builder.build();
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.officeCode = officeCode;
        this.schoolCode = schoolCode;
        this.defaultSchoolName = defaultSchoolName;
    }

    public MealResponse fetch(LocalDate date) {
        Map<String, Object> response;
        try {
            var uri = UriComponentsBuilder.fromUriString(endpoint)
                    .queryParam("Type", "json")
                    .queryParam("pIndex", 1)
                    .queryParam("pSize", 5)
                    .queryParam("ATPT_OFCDC_SC_CODE", officeCode)
                    .queryParam("SD_SCHUL_CODE", schoolCode)
                    .queryParam("MLSV_YMD", date.format(DateTimeFormatter.BASIC_ISO_DATE));
            if (!apiKey.isBlank()) {
                uri.queryParam("KEY", apiKey);
            }
            URI target = uri.build().encode().toUri();

            response = client.get().uri(target)
                    // NEIS는 Accept: application/json에 500을 반환한다. Type=json 쿼리로 JSON을 받는다.
                    .accept(MediaType.ALL).retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
        } catch (RestClientException | IllegalArgumentException exception) {
            // 예외 메시지에는 KEY가 포함된 요청 URL이 들어 있으므로 클래스 이름만 기록한다.
            log.warn("NEIS request failed: {} (cause: {})", exception.getClass().getSimpleName(),
                    exception.getCause() == null ? "none" : exception.getCause().getClass().getSimpleName());
            throw new ExternalApiException();
        }
        return toResponse(date, response);
    }

    private MealResponse toResponse(LocalDate date, Map<String, Object> response) {
        if (response == null || response.isEmpty()) {
            throw new ExternalApiException();
        }
        if (response.get("RESULT") instanceof Map<?, ?> result) {
            // INFO-200은 해당 날짜에 급식이 없을 때의 정상 응답이다.
            if ("INFO-200".equals(result.get("CODE"))) {
                return new MealResponse(date.toString(), defaultSchoolName, List.of());
            }
            log.warn("NEIS returned an API error code: {}", result.get("CODE"));
            throw new ExternalApiException();
        }
        try {
            List<?> sections = (List<?>) response.get("mealServiceDietInfo");
            Map<?, ?> body = (Map<?, ?>) sections.get(1);
            List<?> rows = (List<?>) body.get("row");
            List<MealItem> meals = new ArrayList<>();
            String school = defaultSchoolName;
            for (Object o : rows) {
                Map<?, ?> row = (Map<?, ?>) o;
                if (row.get("SCHUL_NM") instanceof String name && !name.isBlank()) {
                    school = name;
                }
                meals.add(new MealItem(
                        String.valueOf(row.get("MMEAL_SC_NM")),
                        parseMenu(String.valueOf(row.get("DDISH_NM"))),
                        row.get("CAL_INFO") == null ? "" : String.valueOf(row.get("CAL_INFO"))));
            }
            return new MealResponse(date.toString(), school, meals);
        } catch (RuntimeException exception) {
            log.warn("NEIS response had an unexpected shape: {}", exception.getClass().getSimpleName());
            throw new ExternalApiException();
        }
    }

    static List<String> parseMenu(String dishes) {
        return Arrays.stream(dishes.split("(?i)<br\\s*/?>"))
                .map(item -> item.replaceAll("\\s*\\([0-9.\\s]*\\)", "").trim())
                .filter(item -> !item.isEmpty())
                .toList();
    }
}

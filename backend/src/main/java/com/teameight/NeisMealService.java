package com.teameight;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    public NeisMealService(RestClient.Builder builder,
            @Value("${neis.endpoint}") String endpoint,
            @Value("${neis.api-key}") String apiKey,
            @Value("${neis.office-code}") String officeCode,
            @Value("${neis.school-code}") String schoolCode) {
        this.client = builder.build();
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.officeCode = officeCode;
        this.schoolCode = schoolCode;
    }

    public Map<String, Object> fetch(LocalDate date) {
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

        try {
            Map<String, Object> response = client.get().uri(target)
                    // NEIS returns HTTP 500 for Accept: application/json. Type=json selects JSON.
                    .accept(MediaType.ALL).retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
            if (response == null || response.isEmpty()) {
                throw new ExternalApiException();
            }
            if (response.get("RESULT") instanceof Map<?, ?> result) {
                // INFO-200 is a normal NEIS response when there is no meal for the date.
                if (!"INFO-200".equals(result.get("CODE"))) {
                    log.warn("NEIS returned an API error code: {}", result.get("CODE"));
                    throw new ExternalApiException();
                }
            } else if (!response.containsKey("mealServiceDietInfo")) {
                throw new ExternalApiException();
            }
            return response;
        } catch (RestClientException exception) {
            // Upstream exceptions contain the request URL, including KEY. Never expose it.
            log.warn("NEIS request failed: {} (cause: {})", exception.getClass().getSimpleName(),
                    exception.getCause() == null ? "none" : exception.getCause().getClass().getSimpleName());
            throw new ExternalApiException();
        }
    }
}

package com.example.dockerpractice;

import java.io.IOException;
import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class NeisMealServiceTest {

    private static final LocalDate DATE = LocalDate.of(2026, 10, 22);
    private static final String KEY = "private-test-key";

    private MockRestServiceServer server;
    private NeisMealService service;

    @BeforeEach
    void setUp() {
        var builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        service = new NeisMealService(builder, "https://open.neis.go.kr/hub/mealServiceDietInfo",
                KEY, "R10", "8750829", "기본학교");
    }

    @Test
    void transformsNormalResponse() {
        String body = """
                {"mealServiceDietInfo":[{"head":[{"list_total_count":1}]},{"row":[
                  {"SCHUL_NM":"테스트고","MMEAL_SC_NM":"중식",
                   "DDISH_NM":"잡곡밥<br/>된장찌개 (5.6.9)<br/>배추김치(9.13)<br/>","CAL_INFO":"842.3 Kcal"}]}]}
                """;
        server.expect(queryParam("MLSV_YMD", "20261022"))
                .andExpect(queryParam("KEY", KEY))
                .andExpect(queryParam("ATPT_OFCDC_SC_CODE", "R10"))
                .andExpect(queryParam("SD_SCHUL_CODE", "8750829"))
                .andExpect(queryParam("Type", "json"))
                .andExpect(header(HttpHeaders.ACCEPT, "*/*"))
                .andRespond(withSuccess(body, MediaType.APPLICATION_JSON));

        MealResponse result = service.fetch(DATE);

        assertThat(result.date()).isEqualTo("2026-10-22");
        assertThat(result.school()).isEqualTo("테스트고");
        assertThat(result.meals()).containsExactly(
                new MealItem("중식", java.util.List.of("잡곡밥", "된장찌개", "배추김치"), "842.3 Kcal"));
        server.verify();
    }

    @Test
    void noMealReturnsEmptyList() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withSuccess("{\"RESULT\":{\"CODE\":\"INFO-200\",\"MESSAGE\":\"none\"}}",
                        MediaType.APPLICATION_JSON));

        MealResponse result = service.fetch(DATE);

        assertThat(result.meals()).isEmpty();
        assertThat(result.date()).isEqualTo("2026-10-22");
        assertThat(result.school()).isEqualTo("기본학교");
    }

    @Test
    void httpFailureIsTranslatedWithoutKey() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED).body(KEY));
        assertThatThrownBy(() -> service.fetch(DATE))
                .isInstanceOf(ExternalApiException.class)
                .hasMessageNotContaining(KEY)
                .hasNoCause();
    }

    @Test
    void networkFailureIsTranslated() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withException(new IOException("connection timed out")));
        assertThatThrownBy(() -> service.fetch(DATE)).isInstanceOf(ExternalApiException.class);
    }

    @Test
    void neisErrorCodeWithHttp200IsRejected() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withSuccess("{\"RESULT\":{\"CODE\":\"ERROR-290\",\"MESSAGE\":\"invalid key\"}}",
                        MediaType.APPLICATION_JSON));
        assertThatThrownBy(() -> service.fetch(DATE)).isInstanceOf(ExternalApiException.class);
    }

    @Test
    void malformedBodyIsRejected() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withSuccess("{\"mealServiceDietInfo\":[]}", MediaType.APPLICATION_JSON));
        assertThatThrownBy(() -> service.fetch(DATE)).isInstanceOf(ExternalApiException.class);
    }

    @Test
    void invalidEndpointIsTranslatedWithoutExposingConfiguration() {
        NeisMealService invalidEndpointService = new NeisMealService(RestClient.builder(),
                "not a valid endpoint", KEY, "R10", "8750829", "기본학교");

        assertThatThrownBy(() -> invalidEndpointService.fetch(DATE))
                .isInstanceOf(ExternalApiException.class)
                .hasMessageNotContaining(KEY)
                .hasNoCause();
    }
}

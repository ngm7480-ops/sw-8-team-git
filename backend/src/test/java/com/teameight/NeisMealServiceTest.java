package com.teameight;

import java.io.IOException;
import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class NeisMealServiceTest {
    private MockRestServiceServer server;
    private NeisMealService service;
    private static final LocalDate DATE = LocalDate.of(2026, 10, 22);

    @BeforeEach
    void setUp() {
        var builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        service = new NeisMealService(builder, "https://open.neis.go.kr/hub/mealServiceDietInfo",
                "private-test-key", "R10", "8750829");
    }

    @Test
    void sendsSchoolDateAndServerSideKey() {
        server.expect(queryParam("MLSV_YMD", "20261022"))
                .andExpect(queryParam("KEY", "private-test-key"))
                .andExpect(queryParam("ATPT_OFCDC_SC_CODE", "R10"))
                .andExpect(queryParam("SD_SCHUL_CODE", "8750829"))
                .andExpect(queryParam("Type", "json"))
                .andExpect(header(HttpHeaders.ACCEPT, "*/*"))
                .andRespond(withSuccess("{\"mealServiceDietInfo\":[{\"row\":[{\"DDISH_NM\":\"밥\"}]}]}", MediaType.APPLICATION_JSON));
        assertThat(service.fetch(DATE)).containsKey("mealServiceDietInfo");
        server.verify();
    }

    @Test
    void preservesNoMealResult() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withSuccess("{\"RESULT\":{\"CODE\":\"INFO-200\",\"MESSAGE\":\"해당하는 데이터가 없습니다.\"}}", MediaType.APPLICATION_JSON));
        assertThat(service.fetch(DATE)).containsKey("RESULT");
    }

    @Test
    void translatesUpstreamHttpFailureWithoutExposingKey() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED).body("private-test-key"));
        assertThatThrownBy(() -> service.fetch(DATE))
                .isInstanceOf(ExternalApiException.class)
                .hasMessageNotContaining("private-test-key")
                .hasNoCause();
    }

    @Test
    void translatesNetworkFailure() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withException(new IOException("connection timed out")));
        assertThatThrownBy(() -> service.fetch(DATE)).isInstanceOf(ExternalApiException.class);
    }

    @Test
    void rejectsNeisErrorEvenWithHttp200() {
        server.expect(queryParam("Type", "json"))
                .andRespond(withSuccess("{\"RESULT\":{\"CODE\":\"ERROR-290\",\"MESSAGE\":\"invalid key\"}}", MediaType.APPLICATION_JSON));
        assertThatThrownBy(() -> service.fetch(DATE)).isInstanceOf(ExternalApiException.class);
    }
}

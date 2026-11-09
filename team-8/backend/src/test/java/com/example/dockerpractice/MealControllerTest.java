package com.example.dockerpractice;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MealControllerTest {

    private final NeisMealService service = mock(NeisMealService.class);
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new MealController(service))
            .setControllerAdvice(new ApiExceptionHandler()).build();

    @Test
    void returnsContractShape() throws Exception {
        when(service.fetch(LocalDate.of(2026, 11, 9))).thenReturn(new MealResponse("2026-11-09", "학교",
                List.of(new MealItem("중식", List.of("잡곡밥", "된장찌개"), "842.3 Kcal"))));
        mvc.perform(get("/api/meals").param("date", "2026-11-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value("2026-11-09"))
                .andExpect(jsonPath("$.school").value("학교"))
                .andExpect(jsonPath("$.meals[0].type").value("중식"))
                .andExpect(jsonPath("$.meals[0].menu[1]").value("된장찌개"))
                .andExpect(jsonPath("$.meals[0].calories").value("842.3 Kcal"));
    }

    @Test
    void invalidDateReturns400WithoutCallingService() throws Exception {
        mvc.perform(get("/api/meals").param("date", "abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
        verifyNoInteractions(service);
    }

    @Test
    void externalFailureReturns502() throws Exception {
        when(service.fetch(LocalDate.of(2026, 11, 9))).thenThrow(new ExternalApiException());
        mvc.perform(get("/api/meals").param("date", "2026-11-09"))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }
}

package com.example.dockerpractice;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MealControllerTest {

    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new MealController())
            .setControllerAdvice(new ApiExceptionHandler()).build();

    @Test
    void returnsContractShapeAndEchoesDate() throws Exception {
        mvc.perform(get("/api/meals").param("date", "2026-11-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value("2026-11-09"))
                .andExpect(jsonPath("$.school").isNotEmpty())
                .andExpect(jsonPath("$.meals[0].type").value("조식"))
                .andExpect(jsonPath("$.meals[1].menu[0]").isNotEmpty())
                .andExpect(jsonPath("$.meals[2].calories").isNotEmpty());
    }

    @Test
    void invalidDateReturns400WithMessage() throws Exception {
        mvc.perform(get("/api/meals").param("date", "abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }
}

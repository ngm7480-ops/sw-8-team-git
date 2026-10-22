package com.teameight;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MealControllerTest {
    @Test
    void invalidDateDoesNotCallExternalApi() throws Exception {
        var service = mock(NeisMealService.class);
        var mvc = MockMvcBuilders.standaloneSetup(new MealController(service))
                .setControllerAdvice(new ApiExceptionHandler()).build();
        mvc.perform(get("/api/meals").param("date", "2026-99-99")).andExpect(status().isBadRequest());
        verifyNoInteractions(service);
    }
}

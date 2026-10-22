package com.teameight;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MealController {
    private final NeisMealService meals;

    public MealController(NeisMealService meals) {
        this.meals = meals;
    }

    @GetMapping("/api/meals")
    public Map<String, Object> meals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return meals.fetch(date == null ? LocalDate.now(ZoneId.of("Asia/Seoul")) : date);
    }
}

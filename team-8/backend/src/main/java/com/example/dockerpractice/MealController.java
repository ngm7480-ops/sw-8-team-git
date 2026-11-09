package com.example.dockerpractice;

import java.time.LocalDate;
import java.time.ZoneId;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MealController {

    private final NeisMealService mealService;

    public MealController(NeisMealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping("/api/meals")
    public MealResponse meals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return mealService.fetch(date == null ? LocalDate.now(ZoneId.of("Asia/Seoul")) : date);
    }
}

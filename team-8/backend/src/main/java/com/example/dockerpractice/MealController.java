package com.example.dockerpractice;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MealController {

    @GetMapping("/api/meals")
    public MealResponse meals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = date == null ? LocalDate.now(ZoneId.of("Asia/Seoul")) : date;
        // Spec 2-B: 고정 데이터. Spec 3에서 NEIS 데이터로 교체한다.
        return new MealResponse(target.toString(), "경북소프트웨어마이스터고등학교", List.of(
                new MealItem("조식", List.of("현미밥", "미역국", "계란말이", "배추김치"), "650.1 Kcal"),
                new MealItem("중식", List.of("잡곡밥", "된장찌개", "배추김치"), "842.3 Kcal"),
                new MealItem("석식", List.of("쌀밥", "제육볶음", "콩나물국", "깍두기"), "780.5 Kcal")));
    }
}

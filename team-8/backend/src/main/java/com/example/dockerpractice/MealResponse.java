package com.example.dockerpractice;

import java.util.List;

public record MealResponse(String date, String school, List<MealItem> meals) {
}

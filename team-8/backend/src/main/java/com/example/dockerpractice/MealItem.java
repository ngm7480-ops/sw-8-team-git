package com.example.dockerpractice;

import java.util.List;

public record MealItem(String type, List<String> menu, String calories) {
}

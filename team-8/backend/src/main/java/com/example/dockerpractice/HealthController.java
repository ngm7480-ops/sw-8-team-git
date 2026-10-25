package com.example.dockerpractice;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Spring Boot Backend 자체가 실행 중인지 확인한다.
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("message", "Spring Boot is running");
    }

    // Spring Boot에서 MySQL Container까지 연결되는지 확인한다.
    @GetMapping("/health/db")
    public ResponseEntity<Map<String, String>> databaseHealth() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);

            return ResponseEntity.ok(
                Map.of("message", "MySQL connected")
            );
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "MySQL connection failed"));
        }
    }
}

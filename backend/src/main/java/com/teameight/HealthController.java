package com.teameight;

import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    private final JdbcTemplate jdbc;

    public HealthController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("message", "Spring Boot is running");
    }

    @GetMapping("/health/db")
    public ResponseEntity<Map<String, String>> databaseHealth() {
        try {
            jdbc.queryForObject("SELECT 1", Integer.class);
            return ResponseEntity.ok(Map.of("message", "MySQL connected"));
        } catch (DataAccessException exception) {
            return ResponseEntity.status(503).body(Map.of("message", "MySQL connection failed"));
        }
    }
}

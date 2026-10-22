package com.teameight;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<Map<String, String>> externalApi(ExternalApiException exception) {
        return ResponseEntity.status(502).body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> invalidDate() {
        return ResponseEntity.badRequest().body(Map.of("message", "date는 YYYY-MM-DD 형식의 날짜여야 합니다."));
    }
}

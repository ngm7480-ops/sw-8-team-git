package com.example.dockerpractice;

public class ExternalApiException extends RuntimeException {

    public ExternalApiException() {
        super("급식 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
}

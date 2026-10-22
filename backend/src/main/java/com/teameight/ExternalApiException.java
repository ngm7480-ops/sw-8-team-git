package com.teameight;

public class ExternalApiException extends RuntimeException {
    public ExternalApiException() {
        super("나이스 API 호출에 실패했습니다. API 설정과 네트워크를 확인하세요.");
    }
}

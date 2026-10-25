# 1단계: Maven과 Java 21을 이용해 Spring Boot 애플리케이션을 빌드한다.
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# dependency 정보부터 복사해 Maven dependency를 먼저 준비한다.
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# 실제 소스 코드를 복사하고 실행 가능한 JAR을 만든다.
COPY src ./src
RUN mvn -q -DskipTests package

# 2단계: 실행에 필요한 Java Runtime만 남긴다.
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# build 단계에서 만든 JAR을 실행 Image로 가져온다.
COPY --from=build /app/target/*.jar app.jar

# Spring Boot가 사용하는 Port
EXPOSE 8080

# Container가 시작되면 Spring Boot 애플리케이션을 실행한다.
CMD ["java", "-jar", "app.jar"]

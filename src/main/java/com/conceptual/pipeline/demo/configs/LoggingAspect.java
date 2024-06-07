package com.conceptual.pipeline.demo.configs;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restController() {
    }

    @Before("restController()")
    public void logBeforeRestCall(JoinPoint joinPoint) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String method = request.getMethod();
        String url = request.getRequestURL().toString();
        try {
            log.info("HTTP Method: {}, Request URL: {}", method, url);
            log.info("Request Params Or Body: {}", objectMapper.writeValueAsString(joinPoint.getArgs()));
        } catch (Exception e) {
            log.error(e.getMessage());
        }

    }

    @AfterReturning(pointcut = "restController()", returning = "result")
    public void logAfterRestCall(Object result) {
        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();

        try {
            if (response != null) {
                log.info("Response Status: {}", response.getStatus());
                log.info("Response body: {}", objectMapper.writeValueAsString(result));
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    private String getRequestBody(HttpServletRequest request) {
        StringBuilder body = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            reader.lines().forEach(line -> body.append(line).append("\n"));
        } catch (IOException e) {
            log.error("Failed to read request body", e);
        }
        return body.toString().trim();
    }
}

package com.talentshare.backend.interceptor;

import com.talentshare.backend.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoggingInterceptor implements HandlerInterceptor {
    @Autowired
    private AuditLogService auditLogService;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        if (request.getMethod().equals("GET")) return; // Ne loguez pas les GET

        String action = request.getMethod() + " " + request.getRequestURI();
        String details = "Status: " + response.getStatus();

        auditLogService.log(action, details, request);
    }
}
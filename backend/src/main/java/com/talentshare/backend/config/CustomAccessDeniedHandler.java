package com.talentshare.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        // This triggers when:
        // - Valid token exists but lacks required permissions
        // - User tries to access admin-only endpoints

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
        response.getWriter().write("""
            {
                "status": "error",
                "message": "Insufficient permissions",
                "requiredRole": "ADMIN", // Example - can be dynamic
                "path": "%s"
            }
            """.formatted(request.getServletPath()));
    }
}
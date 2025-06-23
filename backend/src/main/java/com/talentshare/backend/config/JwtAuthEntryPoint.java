package com.talentshare.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        // This triggers when:
        // - No token is provided
        // - Invalid token format
        // - Token verification fails

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.getWriter().write("""
            {
                "status": "error",
                "message": "Authentication required",
                "path": "%s",
                "timestamp": "%s"
            }
            """.formatted(
                request.getServletPath(),
                java.time.Instant.now()
        ));
    }
}
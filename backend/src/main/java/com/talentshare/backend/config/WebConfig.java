package com.talentshare.backend.config;

import com.talentshare.backend.interceptor.LoggingInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private LoggingInterceptor loggingInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggingInterceptor).excludePathPatterns(
                "/api/auth/**",         // éviter les logs sur login, refresh, etc.
                "/api/audit-logs/**",   // éviter les logs circulaires
                "/error"                // ne pas loguer les appels vers la page d’erreur
        );
    }
}

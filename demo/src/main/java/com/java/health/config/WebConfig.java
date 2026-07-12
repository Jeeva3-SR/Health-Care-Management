package com.java.health.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Exposes your local uploads directory over HTTP
        registry.addResourceHandler("/api/proofs/**")
                .addResourceLocations("file:/var/medical-app/proofs/");
    }
}
package com.sismoview;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * SismoView Backend Application
 * 
 * Aplicación Spring Boot para la simulación y visualización de datos sísmicos.
 * Proporciona APIs REST para el cálculo de propagación de ondas P/S,
 * intensidad sísmica y simulaciones de tsunami.
 * 
 * @author Santiago13dev
 * @version 1.0.0
 * @since 2025
 */
@Slf4j
@SpringBootApplication
public class SismoViewBackendApplication {

    private static final String APP_NAME = "SismoView Backend";
    private static final String VERSION = "1.0.0";

    public static void main(String[] args) {
        // Configurar propiedades del sistema antes del startup
        configureSystemProperties();
        
        // Crear la aplicación Spring Boot
        SpringApplication app = new SpringApplication(SismoViewBackendApplication.class);
        
        // Configurar banner personalizado
        app.setBannerMode(Banner.Mode.CONSOLE);
        
        // Ejecutar la aplicación
        app.run(args);
    }

    /**
     * Configura propiedades del sistema para optimizar el rendimiento
     */
    private static void configureSystemProperties() {
        // Optimizaciones de JVM para contenedores
        System.setProperty("java.awt.headless", "true");
        System.setProperty("spring.jmx.enabled", "false");
        
        // Configuración de logging
        System.setProperty("logging.pattern.console", 
            "%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} " +
            "%clr(%5p) %clr([%15.15t]){faint} " +
            "%clr(%-40.40logger{39}){cyan} : %m%n%wEx");
    }

    /**
     * Event listener ejecutado cuando la aplicación está completamente iniciada
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        Environment env = event.getApplicationContext().getEnvironment();
        
        String serverPort = env.getProperty("server.port", "8080");
        String contextPath = env.getProperty("server.servlet.context-path", "");
        String activeProfiles = String.join(", ", env.getActiveProfiles());
        
        if (activeProfiles.isEmpty()) {
            activeProfiles = "default";
        }

        log.info("┌─────────────────────────────────────────────────────────────┐");
        log.info("│                    {} Started                    │", APP_NAME);
        log.info("├─────────────────────────────────────────────────────────────┤");
        log.info("│ Version:        {}                                     │", VERSION);
        log.info("│ Started at:     {}                      │", 
                 LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        log.info("│ Server Port:    {}                                         │", serverPort);
        log.info("│ Context Path:   {}                                          │", 
                 contextPath.isEmpty() ? "/" : contextPath);
        log.info("│ Active Profile: {}                                   │", activeProfiles);
        log.info("├─────────────────────────────────────────────────────────────┤");
        log.info("│ Local URL:      http://localhost:{}{}                 │", serverPort, contextPath);
        log.info("│ Health Check:   http://localhost:{}{}/actuator/health     │", serverPort, contextPath);
        log.info("│ API Docs:       http://localhost:{}{}/swagger-ui.html     │", serverPort, contextPath);
        log.info("└─────────────────────────────────────────────────────────────┘");
        
        // Log de información adicional para desarrollo
        if (env.acceptsProfiles("dev", "development")) {
            log.info("🔧 Development mode enabled - Hot reload and debug features active");
        }
        
        if (env.acceptsProfiles("docker")) {
            log.info("🐳 Docker mode enabled - Optimized for containerized deployment");
        }
    }
}

package com.sismoview.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("SismoView API")
                .version("1.0.0")
                .description("API para simulación de propagación sísmica y tsunamis")
                .contact(new Contact()
                    .name("SismoView Team")
                    .email("contact@sismoview.com")
                    .url("https://sismoview.com"))
                .license(new License()
                    .name("MIT")
                    .url("https://opensource.org/licenses/MIT")));
    }
}
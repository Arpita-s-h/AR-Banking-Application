package com.arpita.arbank;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "AR Banking Application",
                description = "Secure Banking Backend APIs",
                version = "v1.0",
                contact = @Contact(
                        name = "Arpita",
                        email = "arpita@example.com"
                ),
                license = @License(
                        name = "AR Banking License"
                )
        ),
        externalDocs = @ExternalDocumentation(
                description = "AR Banking Application Documentation"
        )
)
public class ARBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(ARBankApplication.class, args);
    }

}
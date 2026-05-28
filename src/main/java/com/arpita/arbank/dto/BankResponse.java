package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(
        name = "Bank Response",
        description = "Standard API response object for banking operations"
)
public class BankResponse {

    @Schema(
            description = "Response status code",
            example = "200"
    )
    private String responseCode;

    @Schema(
            description = "Response message",
            example = "Account created successfully"
    )
    private String responseMessage;

    @Schema(
            description = "Customer account information"
    )
    private AccountInfo accountInfo;

    @Schema(
            description = "API response timestamp",
            example = "2026-05-15T12:30:00"
    )
    private LocalDateTime responseTime;
}
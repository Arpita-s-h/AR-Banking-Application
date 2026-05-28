package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(
        name = "Transfer Request",
        description = "Request object for transferring funds between accounts"
)
public class TransferRequest {

    @NotBlank(message = "Source account number cannot be empty")
    @Pattern(regexp = "\\d{10}", message = "Source account number must be 10 digits")
    @Schema(
            description = "Sender account number",
            example = "9012345678"
    )
    private String sourceAccountNumber;

    @NotBlank(message = "Destination account number cannot be empty")
    @Pattern(regexp = "\\d{10}", message = "Destination account number must be 10 digits")
    @Schema(
            description = "Receiver account number",
            example = "9087654321"
    )
    private String destinationAccountNumber;

    @NotNull(message = "Transfer amount cannot be null")
    @DecimalMin(value = "1.0", message = "Transfer amount must be greater than zero")
    @Schema(
            description = "Transfer amount",
            example = "2500"
    )
    private BigDecimal amount;
}
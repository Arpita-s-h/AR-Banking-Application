package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
        name = "Credit/Debit Request",
        description = "Request object for crediting or debiting customer account"
)
public class CreditDebitRequest {

    @NotBlank(message = "Account number cannot be empty")
    @Schema(
            description = "Customer account number",
            example = "9012345678"
    )
    private String accountNumber;

    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "1.0", message = "Amount must be greater than zero")
    @Schema(
            description = "Transaction amount",
            example = "5000"
    )
    private BigDecimal amount;
}
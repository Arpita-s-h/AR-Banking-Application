package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(
        name = "Account Information",
        description = "Contains customer bank account details"
)
public class AccountInfo {

    @Schema(
            description = "Customer account holder name",
            example = "Arpita K"
    )
    private String accountName;

    @Schema(
            description = "Current account balance",
            example = "5000.00"
    )
    private BigDecimal accountBalance;

    @Schema(
            description = "Generated bank account number",
            example = "9012345678"
    )
    private String accountNumber;
}
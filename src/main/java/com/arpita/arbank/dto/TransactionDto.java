package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(
        name = "Transaction Details",
        description = "Represents customer banking transaction information"
)
public class TransactionDto {

    @Schema(
            description = "Transaction type",
            example = "CREDIT"
    )
    private String transactionType;

    @Schema(
            description = "Transaction amount",
            example = "5000"
    )
    private BigDecimal amount;

    @Schema(
            description = "Customer account number",
            example = "9012345678"
    )
    private String accountNumber;

    @Schema(
            description = "Transaction status",
            example = "SUCCESS"
    )
    private String status;

    @Schema(
            description = "Transaction reference number",
            example = "TXN20260515001"
    )
    private String transactionReference;

    @Schema(
            description = "Transaction timestamp",
            example = "2026-05-15T14:30:00"
    )
    private LocalDateTime transactionTime;
}
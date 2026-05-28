package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(
        name = "Enquiry Request",
        description = "Request object for account enquiry operations"
)
public class EnquiryRequest {

    @NotBlank(message = "Account number cannot be empty")
    @Schema(
            description = "Customer bank account number",
            example = "9012345678"
    )
    private String accountNumber;
}
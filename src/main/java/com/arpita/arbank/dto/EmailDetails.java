package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(
        name = "Email Details",
        description = "Contains email notification details"
)
public class EmailDetails {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Recipient email cannot be empty")
    @Schema(
            description = "Recipient email address",
            example = "arpita@gmail.com"
    )
    private String recipient;

    @NotBlank(message = "Message body cannot be empty")
    @Schema(
            description = "Email message body",
            example = "Your account has been credited successfully."
    )
    private String messageBody;

    @NotBlank(message = "Subject cannot be empty")
    @Schema(
            description = "Email subject",
            example = "Transaction Alert"
    )
    private String subject;

    @Schema(
            description = "Optional attachment file path",
            example = "C:/statements/account_statement.pdf"
    )
    private String attachment;
}
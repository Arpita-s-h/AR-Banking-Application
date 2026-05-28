package com.arpita.arbank.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(
        name = "User Registration Request",
        description = "Request object for creating a new customer bank account"
)
public class UserRequest {

    @NotBlank(message = "First name cannot be empty")
    @Schema(
            description = "Customer first name",
            example = "Arpita"
    )
    private String firstName;

    @NotBlank(message = "Last name cannot be empty")
    @Schema(
            description = "Customer last name",
            example = "K"
    )
    private String lastName;

    @Schema(
            description = "Customer middle/other name",
            example = "R"
    )
    private String otherName;

    @NotBlank(message = "Gender cannot be empty")
    @Schema(
            description = "Customer gender",
            example = "Female"
    )
    private String gender;

    @NotBlank(message = "Address cannot be empty")
    @Schema(
            description = "Customer residential address",
            example = "Bangalore, Karnataka"
    )
    private String address;

    @NotBlank(message = "State of origin cannot be empty")
    @Schema(
            description = "Customer state of origin",
            example = "Karnataka"
    )
    private String stateOfOrigin;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be empty")
    @Schema(
            description = "Customer email address",
            example = "arpita@gmail.com"
    )
    private String email;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    @Schema(
            description = "Primary phone number",
            example = "9876543210"
    )
    private String phoneNumber;

    @Pattern(regexp = "\\d{10}", message = "Alternative phone number must be 10 digits")
    @Schema(
            description = "Alternative phone number",
            example = "9123456780"
    )
    private String alternativePhoneNumber;
}
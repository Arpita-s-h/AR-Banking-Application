package com.arpita.arbank.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * NEW FILE — create at: dto/auth/LoginResponse.java
 * Returned to the client after successful login.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String tokenType;      // "Bearer"
    private String email;
    private String accountNumber;
    private String fullName;
    private String role;
}
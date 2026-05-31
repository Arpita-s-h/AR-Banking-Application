package com.arpita.arbank.dto.auth;

import lombok.Data;

/**
 * NEW FILE — create at: dto/auth/LoginRequest.java
 */
@Data
public class LoginRequest {
    private String email;
    private String password;
}
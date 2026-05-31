package com.arpita.arbank.dto.auth;

import lombok.Data;

/**
 * NEW FILE — create at: dto/auth/RegisterRequest.java
 * Extends the existing account creation with a password field.
 */
@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String otherName;
    private String gender;
    private String address;
    private String stateOfOrigin;
    private String email;
    private String password;       // NEW
    private String phoneNumber;
    private String alternativePhoneNumber;
}
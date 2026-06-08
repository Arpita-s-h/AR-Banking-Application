package com.arpita.arbank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * NEW FILE — create at: dto/ProfileResponse.java
 * Returned by GET /api/arbank/users/profile
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {
    private String firstName;
    private String lastName;
    private String otherName;
    private String email;
    private String phoneNumber;
    private String alternativePhoneNumber;
    private String gender;
    private String address;
    private String stateOfOrigin;
    private String accountNumber;
    private BigDecimal accountBalance;
    private String status;
    private Boolean accountLocked;
    private LocalDateTime createdAt;
}
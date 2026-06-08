package com.arpita.arbank.dto;

import lombok.Data;

/**
 * NEW FILE — create at: dto/UpdateProfileRequest.java
 */
@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String otherName;
    private String gender;
    private String address;
    private String stateOfOrigin;
    private String phoneNumber;
    private String alternativePhoneNumber;
}
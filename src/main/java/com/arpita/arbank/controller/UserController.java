package com.arpita.arbank.controller;

import com.arpita.arbank.dto.*;
import com.arpita.arbank.entity.User;
import com.arpita.arbank.repository.UserRepository;
import com.arpita.arbank.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REPLACE existing UserController.java with this file.
 * Added: GET /profile and PUT /profile endpoints.
 */
@RestController
@RequestMapping("/api/arbank/users")
@RequiredArgsConstructor
@Tag(name = "AR Banking User Management APIs")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Operation(summary = "Create New User Account")
    @ApiResponse(responseCode = "200", description = "Account created successfully")
    @PostMapping
    public BankResponse createAccount(@RequestBody UserRequest userRequest) {
        return userService.createAccount(userRequest);
    }

    @Operation(summary = "Get Logged-In User Profile")
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse profile = ProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .otherName(user.getOtherName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .alternativePhoneNumber(user.getAlternativePhoneNumber())
                .gender(user.getGender())
                .address(user.getAddress())
                .stateOfOrigin(user.getStateOfOrigin())
                .accountNumber(user.getAccountNumber())
                .accountBalance(user.getAccountBalance())
                .status(user.getStatus())
                .accountLocked(user.getAccountLocked())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(profile);
    }

    @Operation(summary = "Update Logged-In User Profile")
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request
    ) {
        ProfileResponse updated = userService.updateProfile(
                userDetails.getUsername(), request
        );
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Balance Enquiry")
    @GetMapping("/balance-enquiry")
    public BankResponse balanceEnquiry(@RequestParam String accountNumber) {
        EnquiryRequest request = new EnquiryRequest();
        request.setAccountNumber(accountNumber);
        return userService.balanceEnquiry(request);
    }

    @GetMapping("/name-enquiry")
    public String nameEnquiry(@RequestParam String accountNumber) {
        EnquiryRequest request = new EnquiryRequest();
        request.setAccountNumber(accountNumber);
        return userService.nameEnquiry(request);
    }

    @PostMapping("/credit")
    public BankResponse creditAccount(@RequestBody CreditDebitRequest request) {
        return userService.creditAccount(request);
    }

    @Operation(summary = "Debit Account")
    @PostMapping("/debit")
    public BankResponse debitAccount(@RequestBody CreditDebitRequest request) {
        return userService.debitAccount(request);
    }

    @Operation(summary = "Transfer Funds")
    @PostMapping("/transfer")
    public BankResponse transfer(@RequestBody TransferRequest request) {
        return userService.transfer(request);
    }
}
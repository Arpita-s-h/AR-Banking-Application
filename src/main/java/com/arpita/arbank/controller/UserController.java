package com.arpita.arbank.controller;

import com.arpita.arbank.dto.*;

import com.arpita.arbank.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/arbank/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "AR Banking User Management APIs")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Create New User Account",
            description = "Creates a new bank account for the user"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Account created successfully"
    )
    @PostMapping
    public BankResponse createAccount(@RequestBody UserRequest userRequest) {
        return userService.createAccount(userRequest);
    }

    @Operation(
            summary = "Balance Enquiry",
            description = "Fetch account balance using account number"
    )
    @GetMapping("/balance-enquiry")
    public BankResponse balanceEnquiry(
            @RequestParam String accountNumber
    ) {

        EnquiryRequest request = new EnquiryRequest();
        request.setAccountNumber(accountNumber);

        return userService.balanceEnquiry(request);
    }
    @GetMapping("/name-enquiry")
    public String nameEnquiry(
            @RequestParam String accountNumber
    ) {

        EnquiryRequest request = new EnquiryRequest();
        request.setAccountNumber(accountNumber);

        return userService.nameEnquiry(request);
    }

    @PostMapping("/credit")
    public BankResponse creditAccount(@RequestBody CreditDebitRequest request) {
        return userService.creditAccount(request);
    }

    @Operation(
            summary = "Debit Account",
            description = "Withdraw money from account"
    )
    @PostMapping("/debit")
    public BankResponse debitAccount(@RequestBody CreditDebitRequest request) {
        return userService.debitAccount(request);
    }

    @Operation(
            summary = "Transfer Funds",
            description = "Transfer money between accounts"
    )
    @PostMapping("/transfer")
    public BankResponse transfer(@RequestBody TransferRequest request) {
        return userService.transfer(request);
    }
}
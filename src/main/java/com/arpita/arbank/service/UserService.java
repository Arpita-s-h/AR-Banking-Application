package com.arpita.arbank.service;

import com.arpita.arbank.dto.*;

/**
 * REPLACE existing UserService.java with this file.
 * Added: updateProfile method.
 */
public interface UserService {

    BankResponse createAccount(UserRequest userRequest);

    BankResponse balanceEnquiry(EnquiryRequest request);

    String nameEnquiry(EnquiryRequest request);

    BankResponse creditAccount(CreditDebitRequest request);

    BankResponse debitAccount(CreditDebitRequest request);

    BankResponse transfer(TransferRequest request);

    ProfileResponse updateProfile(String email, UpdateProfileRequest request); // NEW
}
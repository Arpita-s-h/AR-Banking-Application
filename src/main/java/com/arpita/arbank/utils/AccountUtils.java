package com.arpita.arbank.utils;

import java.security.SecureRandom;
import java.time.Year;

public class AccountUtils {

    private AccountUtils() {
    }

    // ACCOUNT STATUS CODES

    public static final String ACCOUNT_EXISTS_CODE = "001";
    public static final String ACCOUNT_EXISTS_MESSAGE =
            "An account already exists with this email.";

    public static final String ACCOUNT_CREATION_SUCCESS = "002";
    public static final String ACCOUNT_CREATION_MESSAGE =
            "Account created successfully.";

    public static final String ACCOUNT_NOT_EXIST_CODE = "003";
    public static final String ACCOUNT_NOT_EXIST_MESSAGE =
            "Account does not exist.";

    public static final String ACCOUNT_FOUND_CODE = "004";
    public static final String ACCOUNT_FOUND_SUCCESS =
            "Account found successfully.";

    public static final String ACCOUNT_CREDITED_SUCCESS = "005";
    public static final String ACCOUNT_CREDITED_SUCCESS_MESSAGE =
            "Account credited successfully.";

    public static final String INSUFFICIENT_BALANCE_CODE = "006";
    public static final String INSUFFICIENT_BALANCE_MESSAGE =
            "Insufficient account balance.";

    public static final String ACCOUNT_DEBITED_SUCCESS = "007";
    public static final String ACCOUNT_DEBITED_MESSAGE =
            "Account debited successfully.";

    public static final String TRANSFER_SUCCESSFUL_CODE = "008";
    public static final String TRANSFER_SUCCESSFUL_MESSAGE =
            "Transfer completed successfully.";

    private static final SecureRandom random = new SecureRandom();

    public static String generateAccountNumber() {

        /**
         * Example:
         * 2026945831
         */

        Year currentYear = Year.now();

        int min = 100000;
        int max = 999999;

        int randomNumber =
                random.nextInt(max - min + 1) + min;

        return currentYear + String.valueOf(randomNumber);
    }
}
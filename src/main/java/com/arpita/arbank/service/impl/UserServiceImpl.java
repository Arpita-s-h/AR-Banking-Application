package com.arpita.arbank.service.impl;

import com.arpita.arbank.dto.*;
import com.arpita.arbank.entity.User;
import com.arpita.arbank.repository.UserRepository;
import com.arpita.arbank.service.EmailService;
import com.arpita.arbank.service.TransactionService;
import com.arpita.arbank.utils.AccountUtils;
import com.arpita.arbank.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final TransactionService transactionService;

    @Override
    public BankResponse createAccount(UserRequest userRequest) {

        log.info("Creating account for email: {}", userRequest.getEmail());

        if (userRepository.existsByEmail(userRequest.getEmail())) {

            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_EXISTS_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_EXISTS_MESSAGE)
                    .accountInfo(null)
                    .responseTime(LocalDateTime.now())
                    .build();
        }

        User newUser = User.builder()
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .otherName(userRequest.getOtherName())
                .gender(userRequest.getGender())
                .address(userRequest.getAddress())
                .stateOfOrigin(userRequest.getStateOfOrigin())
                .accountNumber(AccountUtils.generateAccountNumber())
                .accountBalance(BigDecimal.ZERO)
                .email(userRequest.getEmail())
                .phoneNumber(userRequest.getPhoneNumber())
                .alternativePhoneNumber(userRequest.getAlternativePhoneNumber())
                .status("ACTIVE")
                .accountLocked(false)
                .build();

        User savedUser = userRepository.save(newUser);

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(savedUser.getEmail())
                .subject("ACCOUNT CREATION")
                .messageBody(
                        "Congratulations! Your AR Banking account has been successfully created.\n\n"
                                + "Account Name: "
                                + savedUser.getFirstName() + " "
                                + savedUser.getLastName() + " "
                                + savedUser.getOtherName()
                                + "\nAccount Number: "
                                + savedUser.getAccountNumber()
                )
                .build();

        // Uncomment after configuring valid SMTP credentials

        // emailService.sendEmailAlert(emailDetails);

        log.info("Account created successfully for {}", savedUser.getEmail());

        return BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_CREATION_SUCCESS)
                .responseMessage(AccountUtils.ACCOUNT_CREATION_MESSAGE)
                .accountInfo(
                        AccountInfo.builder()
                                .accountBalance(savedUser.getAccountBalance())
                                .accountNumber(savedUser.getAccountNumber())
                                .accountName(
                                        savedUser.getFirstName() + " "
                                                + savedUser.getLastName() + " "
                                                + savedUser.getOtherName()
                                )
                                .build()
                )
                .responseTime(LocalDateTime.now())
                .build();
    }

    @Override
    public BankResponse balanceEnquiry(EnquiryRequest request) {

        User foundUser = getUserByAccountNumber(
                request.getAccountNumber()
        );

        return BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_FOUND_CODE)
                .responseMessage(AccountUtils.ACCOUNT_FOUND_SUCCESS)
                .accountInfo(
                        AccountInfo.builder()
                                .accountBalance(foundUser.getAccountBalance())
                                .accountNumber(foundUser.getAccountNumber())
                                .accountName(
                                        foundUser.getFirstName() + " "
                                                + foundUser.getLastName() + " "
                                                + foundUser.getOtherName()
                                )
                                .build()
                )
                .responseTime(LocalDateTime.now())
                .build();
    }

    @Override
    public String nameEnquiry(EnquiryRequest request) {

        User foundUser = getUserByAccountNumber(
                request.getAccountNumber()
        );

        return foundUser.getFirstName() + " "
                + foundUser.getLastName() + " "
                + foundUser.getOtherName();
    }

    @Override
    @Transactional
    public BankResponse creditAccount(CreditDebitRequest request) {

        User userToCredit = getUserByAccountNumber(
                request.getAccountNumber()
        );

        checkIfAccountLocked(userToCredit);

        userToCredit.setAccountBalance(
                userToCredit.getAccountBalance()
                        .add(request.getAmount())
        );

        userRepository.save(userToCredit);

        TransactionDto transactionDto = TransactionDto.builder()
                .accountNumber(userToCredit.getAccountNumber())
                .transactionType("CREDIT")
                .amount(request.getAmount())
                .status("SUCCESS")
                .build();

        transactionService.saveTransaction(transactionDto);

        log.info(
                "Account credited successfully: {}",
                userToCredit.getAccountNumber()
        );

        return BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_CREDITED_SUCCESS)
                .responseMessage(AccountUtils.ACCOUNT_CREDITED_SUCCESS_MESSAGE)
                .accountInfo(
                        AccountInfo.builder()
                                .accountName(
                                        userToCredit.getFirstName() + " "
                                                + userToCredit.getLastName() + " "
                                                + userToCredit.getOtherName()
                                )
                                .accountBalance(userToCredit.getAccountBalance())
                                .accountNumber(userToCredit.getAccountNumber())
                                .build()
                )
                .responseTime(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public BankResponse debitAccount(CreditDebitRequest request) {

        User userToDebit = getUserByAccountNumber(
                request.getAccountNumber()
        );

        checkIfAccountLocked(userToDebit);

        BigDecimal availableBalance = userToDebit.getAccountBalance();

        if (availableBalance.compareTo(request.getAmount()) < 0) {

            return BankResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                    .accountInfo(null)
                    .responseTime(LocalDateTime.now())
                    .build();
        }

        userToDebit.setAccountBalance(
                userToDebit.getAccountBalance()
                        .subtract(request.getAmount())
        );

        userRepository.save(userToDebit);

        TransactionDto transactionDto = TransactionDto.builder()
                .accountNumber(userToDebit.getAccountNumber())
                .transactionType("DEBIT")
                .amount(request.getAmount())
                .status("SUCCESS")
                .build();

        transactionService.saveTransaction(transactionDto);

        log.info(
                "Account debited successfully: {}",
                userToDebit.getAccountNumber()
        );

        return BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_DEBITED_SUCCESS)
                .responseMessage(AccountUtils.ACCOUNT_DEBITED_MESSAGE)
                .accountInfo(
                        AccountInfo.builder()
                                .accountNumber(userToDebit.getAccountNumber())
                                .accountName(
                                        userToDebit.getFirstName() + " "
                                                + userToDebit.getLastName() + " "
                                                + userToDebit.getOtherName()
                                )
                                .accountBalance(userToDebit.getAccountBalance())
                                .build()
                )
                .responseTime(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public BankResponse transfer(TransferRequest request) {

        log.info(
                "Initiating transfer from {} to {}",
                request.getSourceAccountNumber(),
                request.getDestinationAccountNumber()
        );

        User sourceAccountUser = getUserByAccountNumber(
                request.getSourceAccountNumber()
        );

        User destinationAccountUser = getUserByAccountNumber(
                request.getDestinationAccountNumber()
        );

        checkIfAccountLocked(sourceAccountUser);
        checkIfAccountLocked(destinationAccountUser);

        if (request.getAmount().compareTo(
                sourceAccountUser.getAccountBalance()
        ) > 0) {

            return BankResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                    .accountInfo(null)
                    .responseTime(LocalDateTime.now())
                    .build();
        }

        sourceAccountUser.setAccountBalance(
                sourceAccountUser.getAccountBalance()
                        .subtract(request.getAmount())
        );

        destinationAccountUser.setAccountBalance(
                destinationAccountUser.getAccountBalance()
                        .add(request.getAmount())
        );

        userRepository.save(sourceAccountUser);
        userRepository.save(destinationAccountUser);

        String sourceUsername =
                sourceAccountUser.getFirstName() + " "
                        + sourceAccountUser.getLastName() + " "
                        + sourceAccountUser.getOtherName();

        TransactionDto debitTransaction = TransactionDto.builder()
                .accountNumber(sourceAccountUser.getAccountNumber())
                .transactionType("DEBIT")
                .amount(request.getAmount())
                .status("SUCCESS")
                .build();

        transactionService.saveTransaction(debitTransaction);

        TransactionDto creditTransaction = TransactionDto.builder()
                .accountNumber(destinationAccountUser.getAccountNumber())
                .transactionType("CREDIT")
                .amount(request.getAmount())
                .status("SUCCESS")
                .build();

        transactionService.saveTransaction(creditTransaction);

        EmailDetails debitAlert = EmailDetails.builder()
                .subject("DEBIT ALERT")
                .recipient(sourceAccountUser.getEmail())
                .messageBody(
                        "The sum of "
                                + request.getAmount()
                                + " has been deducted from your account.\n"
                                + "Current Balance: "
                                + sourceAccountUser.getAccountBalance()
                )
                .build();

        EmailDetails creditAlert = EmailDetails.builder()
                .subject("CREDIT ALERT")
                .recipient(destinationAccountUser.getEmail())
                .messageBody(
                        "The sum of "
                                + request.getAmount()
                                + " has been credited to your account from "
                                + sourceUsername
                                + ".\nCurrent Balance: "
                                + destinationAccountUser.getAccountBalance()
                )
                .build();

        // Uncomment after SMTP configuration

        // emailService.sendEmailAlert(debitAlert);
        // emailService.sendEmailAlert(creditAlert);

        log.info(
                "Transfer completed successfully from {} to {}",
                request.getSourceAccountNumber(),
                request.getDestinationAccountNumber()
        );

        return BankResponse.builder()
                .responseCode(AccountUtils.TRANSFER_SUCCESSFUL_CODE)
                .responseMessage(AccountUtils.TRANSFER_SUCCESSFUL_MESSAGE)
                .accountInfo(null)
                .responseTime(LocalDateTime.now())
                .build();
    }

    private User getUserByAccountNumber(String accountNumber) {

        return userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));
    }

    private void checkIfAccountLocked(User user) {

        if (Boolean.TRUE.equals(user.getAccountLocked())) {
            throw new RuntimeException("Account is locked");
        }
    }

}
package com.arpita.arbank.service.impl;


import com.arpita.arbank.dto.TransactionDto;
import com.arpita.arbank.entity.Transaction;
import com.arpita.arbank.repository.TransactionRepository;
import com.arpita.arbank.service.TransactionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    @Override
    public void saveTransaction(TransactionDto transactionDto) {

        log.info(
                "Saving transaction for account number: {}",
                transactionDto.getAccountNumber()
        );

        Transaction transaction = Transaction.builder()
                .transactionType(transactionDto.getTransactionType())
                .accountNumber(transactionDto.getAccountNumber())
                .amount(transactionDto.getAmount())
                .status(transactionDto.getStatus())
                .transactionReference(
                        "ARTXN" + System.currentTimeMillis()
                )
                .createdAt(LocalDateTime.now())
                .remarks("Bank transaction processed successfully")
                .build();

        transactionRepository.save(transaction);

        log.info(
                "Transaction saved successfully with reference: {}",
                transaction.getTransactionReference()
        );
    }
}
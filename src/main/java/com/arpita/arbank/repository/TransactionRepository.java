package com.arpita.arbank.repository;

import com.arpita.arbank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByAccountNumber(String accountNumber);

    List<Transaction> findByAccountNumberAndCreatedAtBetween(
            String accountNumber,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    Transaction findByTransactionReference(String transactionReference);
}
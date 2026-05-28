package com.arpita.arbank.service;

import com.arpita.arbank.dto.TransactionDto;

public interface TransactionService {

    void saveTransaction(TransactionDto transactionDto);
}
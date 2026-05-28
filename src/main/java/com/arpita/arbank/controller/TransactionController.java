package com.arpita.arbank.controller;

import com.itextpdf.text.DocumentException;
import com.arpita.arbank.entity.Transaction;
import com.arpita.arbank.service.impl.BankStatement;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/arbank/transactions")
@AllArgsConstructor
public class TransactionController {

    private final BankStatement bankStatementService;

    @GetMapping("/statement")
    public List<Transaction> generateBankStatement(
            @RequestParam String accountNumber,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) throws DocumentException, FileNotFoundException {

        return bankStatementService.generateStatement(
                accountNumber,
                startDate,
                endDate
        );
    }
}
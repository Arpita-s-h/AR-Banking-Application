package com.arpita.arbank.service.impl;

import com.arpita.arbank.service.EmailService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.arpita.arbank.dto.EmailDetails;
import com.arpita.arbank.entity.Transaction;
import com.arpita.arbank.entity.User;
import com.arpita.arbank.repository.TransactionRepository;
import com.arpita.arbank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BankStatement {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    /**
     * Generate account statement PDF
     * Retrieve transactions within date range
     * Generate PDF statement
     * Send statement through email
     */

    public List<Transaction> generateStatement(
            String accountNumber,
            String startDate,
            String endDate
    ) throws DocumentException, FileNotFoundException {

        log.info("Generating bank statement for account number: {}", accountNumber);

        LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE);
        LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ISO_DATE);

        User user = userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        List<Transaction> transactionList =
                transactionRepository.findByAccountNumberAndCreatedAtBetween(
                        accountNumber,
                        start.atStartOfDay(),
                        end.atTime(23, 59, 59)
                );

        String customerName =
                user.getFirstName() + " " +
                        user.getLastName() + " " +
                        user.getOtherName();

        String fileName =
                System.getProperty("user.home")
                        + "/Downloads/AR_Statement_"
                        + accountNumber
                        + ".pdf";

        Rectangle statementSize = new Rectangle(PageSize.A4);

        Document document = new Document(statementSize);

        OutputStream outputStream = new FileOutputStream(fileName);

        PdfWriter.getInstance(document, outputStream);

        document.open();

        // BANK HEADER SECTION

        PdfPTable bankInfoTable = new PdfPTable(1);

        PdfPCell bankName =
                new PdfPCell(new Phrase("AR Banking Application"));

        bankName.setBorder(0);
        bankName.setBackgroundColor(BaseColor.BLUE);
        bankName.setPadding(20f);

        PdfPCell bankAddress =
                new PdfPCell(new Phrase("Bangalore, Karnataka, India"));

        bankAddress.setBorder(0);

        bankInfoTable.addCell(bankName);
        bankInfoTable.addCell(bankAddress);

        // STATEMENT INFO SECTION

        PdfPTable statementInfo = new PdfPTable(2);

        PdfPCell startDateCell =
                new PdfPCell(new Phrase("Start Date: " + startDate));

        startDateCell.setBorder(0);

        PdfPCell statementTitle =
                new PdfPCell(new Phrase("STATEMENT OF ACCOUNT"));

        statementTitle.setBorder(0);

        PdfPCell endDateCell =
                new PdfPCell(new Phrase("End Date: " + endDate));

        endDateCell.setBorder(0);

        PdfPCell customerNameCell =
                new PdfPCell(new Phrase("Customer Name: " + customerName));

        customerNameCell.setBorder(0);

        PdfPCell emptyCell = new PdfPCell();

        emptyCell.setBorder(0);

        PdfPCell addressCell =
                new PdfPCell(new Phrase("Customer Address: " + user.getAddress()));

        addressCell.setBorder(0);

        statementInfo.addCell(startDateCell);
        statementInfo.addCell(statementTitle);
        statementInfo.addCell(endDateCell);
        statementInfo.addCell(customerNameCell);
        statementInfo.addCell(emptyCell);
        statementInfo.addCell(addressCell);

        // TRANSACTION TABLE SECTION

        PdfPTable transactionsTable = new PdfPTable(5);

        PdfPCell dateHeader =
                new PdfPCell(new Phrase("DATE"));

        dateHeader.setBackgroundColor(BaseColor.BLUE);
        dateHeader.setBorder(0);

        PdfPCell transactionTypeHeader =
                new PdfPCell(new Phrase("TRANSACTION TYPE"));

        transactionTypeHeader.setBackgroundColor(BaseColor.BLUE);
        transactionTypeHeader.setBorder(0);

        PdfPCell amountHeader =
                new PdfPCell(new Phrase("AMOUNT"));

        amountHeader.setBackgroundColor(BaseColor.BLUE);
        amountHeader.setBorder(0);

        PdfPCell statusHeader =
                new PdfPCell(new Phrase("STATUS"));

        statusHeader.setBackgroundColor(BaseColor.BLUE);
        statusHeader.setBorder(0);

        PdfPCell referenceHeader =
                new PdfPCell(new Phrase("REFERENCE"));

        referenceHeader.setBackgroundColor(BaseColor.BLUE);
        referenceHeader.setBorder(0);

        transactionsTable.addCell(dateHeader);
        transactionsTable.addCell(transactionTypeHeader);
        transactionsTable.addCell(amountHeader);
        transactionsTable.addCell(statusHeader);
        transactionsTable.addCell(referenceHeader);

        // TRANSACTION DATA

        transactionList.forEach(transaction -> {

            transactionsTable.addCell(
                    new Phrase(String.valueOf(transaction.getCreatedAt()))
            );

            transactionsTable.addCell(
                    new Phrase(transaction.getTransactionType())
            );

            transactionsTable.addCell(
                    new Phrase(transaction.getAmount().toString())
            );

            transactionsTable.addCell(
                    new Phrase(transaction.getStatus())
            );

            transactionsTable.addCell(
                    new Phrase(transaction.getTransactionReference())
            );
        });

        // ADD CONTENT TO DOCUMENT

        document.add(bankInfoTable);
        document.add(statementInfo);
        document.add(transactionsTable);

        document.close();

        log.info("Bank statement generated successfully");

        // EMAIL DETAILS

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(user.getEmail())
                .subject("AR Banking Account Statement")
                .messageBody(
                        "Kindly find your requested account statement attached."
                )
                .attachment(fileName)
                .build();



        emailService.sendEmailWithAttachment(emailDetails);

        return transactionList;
    }
}
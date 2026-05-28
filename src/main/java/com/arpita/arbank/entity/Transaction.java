package com.arpita.arbank.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String transactionId;

    @Column(nullable = false)
    private String transactionType;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String status;

    @Column(unique = true, nullable = false)
    private String transactionReference;

    private String remarks;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
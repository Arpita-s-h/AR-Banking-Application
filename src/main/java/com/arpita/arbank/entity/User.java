package com.arpita.arbank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * REPLACE your existing User.java with this file.
 * Added: password, role fields for JWT authentication.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String otherName;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String stateOfOrigin;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private BigDecimal accountBalance;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // NEW — stores BCrypt-encoded password

    @Column(unique = true, nullable = false)
    private String phoneNumber;

    private String alternativePhoneNumber;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Boolean accountLocked;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // NEW — ROLE_USER or ROLE_ADMIN

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime modifiedAt;
}
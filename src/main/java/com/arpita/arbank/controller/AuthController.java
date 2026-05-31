package com.arpita.arbank.controller;

import com.arpita.arbank.dto.BankResponse;
import com.arpita.arbank.dto.auth.LoginRequest;
import com.arpita.arbank.dto.auth.LoginResponse;
import com.arpita.arbank.dto.auth.RegisterRequest;
import com.arpita.arbank.entity.Role;
import com.arpita.arbank.entity.User;
import com.arpita.arbank.repository.UserRepository;
import com.arpita.arbank.security.JwtTokenProvider;
import com.arpita.arbank.utils.AccountUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * NEW FILE — create at: controller/AuthController.java
 * Handles /api/arbank/auth/register and /api/arbank/auth/login
 */
@RestController
@RequestMapping("/api/arbank/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * POST /api/arbank/auth/register
     * Creates a new customer account with encoded password.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered.");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Phone number already registered.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .otherName(request.getOtherName())
                .gender(request.getGender())
                .address(request.getAddress())
                .stateOfOrigin(request.getStateOfOrigin())
                .accountNumber(AccountUtils.generateAccountNumber())
                .accountBalance(BigDecimal.ZERO)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .alternativePhoneNumber(request.getAlternativePhoneNumber())
                .status("ACTIVE")
                .accountLocked(false)
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                java.util.Map.of(
                        "message", "Account created successfully!",
                        "accountNumber", savedUser.getAccountNumber(),
                        "name", savedUser.getFirstName() + " " + savedUser.getLastName()
                )
        );
    }

    /**
     * POST /api/arbank/auth/login
     * Authenticates user and returns a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return ResponseEntity.ok(
                LoginResponse.builder()
                        .token(token)
                        .tokenType("Bearer")
                        .email(user.getEmail())
                        .accountNumber(user.getAccountNumber())
                        .fullName(user.getFirstName() + " " + user.getLastName())
                        .role(user.getRole().name())
                        .build()
        );
    }
}
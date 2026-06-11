package com.arpita.arbank.controller;

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
import java.util.Map;

@RestController
@RequestMapping("/api/arbank/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered.");
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Phone number already registered.");

        User user = buildUser(request, Role.ROLE_USER);
        User saved = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Account created successfully!",
                "accountNumber", saved.getAccountNumber(),
                "name", saved.getFirstName() + " " + saved.getLastName()
        ));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered.");
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Phone number already registered.");

        User admin = buildUser(request, Role.ROLE_ADMIN);
        User saved = userRepository.save(admin);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Admin account created successfully!",
                "accountNumber", saved.getAccountNumber(),
                "name", saved.getFirstName() + " " + saved.getLastName(),
                "role", "ROLE_ADMIN"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return ResponseEntity.ok(LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(user.getEmail())
                .accountNumber(user.getAccountNumber())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .role(user.getRole().name())
                .build());
    }

    private User buildUser(RegisterRequest req, Role role) {
        return User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .otherName(req.getOtherName())
                .gender(req.getGender())
                .address(req.getAddress())
                .stateOfOrigin(req.getStateOfOrigin())
                .accountNumber(AccountUtils.generateAccountNumber())
                .accountBalance(BigDecimal.ZERO)
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phoneNumber(req.getPhoneNumber())
                .alternativePhoneNumber(req.getAlternativePhoneNumber())
                .status("ACTIVE")
                .accountLocked(false)
                .role(role)
                .build();
    }
}
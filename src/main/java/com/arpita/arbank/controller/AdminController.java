package com.arpita.arbank.controller;

import com.arpita.arbank.dto.AdminStatsResponse;
import com.arpita.arbank.dto.ProfileResponse;
import com.arpita.arbank.entity.Transaction;
import com.arpita.arbank.entity.User;
import com.arpita.arbank.repository.TransactionRepository;
import com.arpita.arbank.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/arbank/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "AR Banking Admin APIs")
public class AdminController {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        List<User> users = userRepository.findAll();

        long totalUsers    = users.size();
        long activeUsers   = users.stream().filter(u -> "ACTIVE".equals(u.getStatus())).count();
        long lockedUsers   = users.stream().filter(u -> Boolean.TRUE.equals(u.getAccountLocked())).count();
        long totalTx       = transactionRepository.count();

        BigDecimal totalBalance = users.stream()
                .map(User::getAccountBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Transaction> allTx = transactionRepository.findAll();

        BigDecimal totalDeposits = allTx.stream()
                .filter(t -> "CREDIT".equals(t.getTransactionType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalWithdrawals = allTx.stream()
                .filter(t -> "DEBIT".equals(t.getTransactionType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .lockedUsers(lockedUsers)
                .totalTransactions(totalTx)
                .totalDeposits(totalDeposits)
                .totalWithdrawals(totalWithdrawals)
                .totalBalanceInSystem(totalBalance)
                .build());
    }

    @GetMapping("/users")
    public ResponseEntity<List<ProfileResponse>> getAllUsers() {
        List<ProfileResponse> users = userRepository.findAll().stream()
                .map(u -> ProfileResponse.builder()
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .email(u.getEmail())
                        .phoneNumber(u.getPhoneNumber())
                        .accountNumber(u.getAccountNumber())
                        .accountBalance(u.getAccountBalance())
                        .status(u.getStatus())
                        .accountLocked(u.getAccountLocked())
                        .gender(u.getGender())
                        .address(u.getAddress())
                        .stateOfOrigin(u.getStateOfOrigin())
                        .createdAt(u.getCreatedAt())
                        .build())
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/search")
    public ResponseEntity<ProfileResponse> searchUser(@RequestParam String accountNumber) {
        User u = userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(ProfileResponse.builder()
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .accountNumber(u.getAccountNumber())
                .accountBalance(u.getAccountBalance())
                .status(u.getStatus())
                .accountLocked(u.getAccountLocked())
                .gender(u.getGender())
                .address(u.getAddress())
                .stateOfOrigin(u.getStateOfOrigin())
                .createdAt(u.getCreatedAt())
                .build());
    }

    @PutMapping("/users/{accountNumber}/block")
    public ResponseEntity<Map<String, String>> blockUser(@PathVariable String accountNumber) {
        User user = userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountLocked(true);
        user.setStatus("BLOCKED");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Account blocked successfully"));
    }

    @PutMapping("/users/{accountNumber}/unblock")
    public ResponseEntity<Map<String, String>> unblockUser(@PathVariable String accountNumber) {
        User user = userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountLocked(false);
        user.setStatus("ACTIVE");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Account unblocked successfully"));
    }

    @DeleteMapping("/users/{accountNumber}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String accountNumber) {
        User user = userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }
}
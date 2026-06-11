package com.arpita.arbank.repository;

import com.arpita.arbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Added: findByAccountNumber, existsByPhoneNumber methods.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByEmail(String email);
    Boolean existsByPhoneNumber(String phoneNumber);
    Optional<User> findByEmail(String email);
    Optional<User> findByAccountNumber(String accountNumber);
}
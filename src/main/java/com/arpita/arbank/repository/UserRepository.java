package com.arpita.arbank.repository;

import com.arpita.arbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email);

    Boolean existsByAccountNumber(String accountNumber);

    Boolean existsByPhoneNumber(String phoneNumber);

    Optional<User> findByAccountNumber(String accountNumber);

    Optional<User> findByEmail(String email);
}
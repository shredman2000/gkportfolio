package com.example.backend.betthebracket.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.betthebracket.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // need for login
    Optional<User> findByEmail(String email);
    Optional<User> findByAuthToken(String authToken);
}
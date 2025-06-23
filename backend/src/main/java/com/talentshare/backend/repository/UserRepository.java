package com.talentshare.backend.repository;

import com.talentshare.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findUserByUsername(@Param("username") String username);
}

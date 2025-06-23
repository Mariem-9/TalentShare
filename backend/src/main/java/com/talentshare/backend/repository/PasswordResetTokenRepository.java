package com.talentshare.backend.repository;

import com.talentshare.backend.model.PasswordResetToken;
import com.talentshare.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiryDate < :now")
    void deleteAllByExpiryDateBefore(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.user = :user")
    void deleteByUser(@Param("user") User user);
}


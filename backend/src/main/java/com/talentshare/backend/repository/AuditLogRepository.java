package com.talentshare.backend.repository;

import com.talentshare.backend.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    void deleteByCreatedAtBefore(LocalDateTime date);
}


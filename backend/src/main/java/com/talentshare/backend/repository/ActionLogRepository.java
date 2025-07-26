package com.talentshare.backend.repository;

import com.talentshare.backend.model.ActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
    int deleteByCreatedAtBefore(LocalDateTime cutoffDate);

}


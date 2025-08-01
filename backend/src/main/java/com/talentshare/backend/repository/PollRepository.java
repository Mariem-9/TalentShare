package com.talentshare.backend.repository;

import com.talentshare.backend.model.Poll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findByGroupeIdOrderByEndDateDesc(Long groupId);
    List<Poll> findByEndDateBeforeAndAnnouncedFalse(LocalDateTime now);


}

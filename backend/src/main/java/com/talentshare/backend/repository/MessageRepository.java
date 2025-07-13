package com.talentshare.backend.repository;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByGroupeOrderByTimestampAsc(Groupe groupe);
}

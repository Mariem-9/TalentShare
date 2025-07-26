package com.talentshare.backend.repository;

import com.talentshare.backend.model.Poll;
import com.talentshare.backend.model.PollChoice;
import com.talentshare.backend.model.PollVote;
import com.talentshare.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PollVoteRepository extends JpaRepository<PollVote, Long> {
    boolean existsByPollAndUser(Poll poll, User user);
    List<PollVote> findByChoice(PollChoice choice);
    Optional<PollVote> findByPollAndUser(Poll poll, User user);

}

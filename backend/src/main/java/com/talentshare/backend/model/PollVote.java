package com.talentshare.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class PollVote {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Poll poll;

    @ManyToOne
    private PollChoice choice;

    @ManyToOne
    private User user;
}


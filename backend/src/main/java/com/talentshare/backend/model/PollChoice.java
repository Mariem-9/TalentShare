package com.talentshare.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class PollChoice {
    @Id
    @GeneratedValue
    private Long id;
    private String text;
    private int voteCount = 0;

    @ManyToOne
    private Poll poll;
    @OneToMany(mappedBy = "choice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PollVote> votes;

}

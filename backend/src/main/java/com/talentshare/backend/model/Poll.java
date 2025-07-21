package com.talentshare.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Poll {
    @Id
    @GeneratedValue
    private Long id;
    private String question;
    private LocalDateTime endDate;

    @ManyToOne
    private Groupe groupe;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PollChoice> choices;

    private boolean announced = false;
}

package com.talentshare.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "groupe_membre", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"groupe_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class GroupeMembre {

    public enum RoleGroupe {
        CREATEUR,
        MODERATEUR,
        MEMBRE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "groupe_id", nullable = false)
    private Groupe groupe;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleGroupe role;
}


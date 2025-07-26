package com.talentshare.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
        MEMBRE,
        EN_ATTENTE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "groupe_id", nullable = false)
    @JsonIgnoreProperties({"createur", "membres", "fichiers", "tags", "avatar"})
    private Groupe groupe;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"groupesCrees", "groupesRejoints", "authorities", "password"})
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleGroupe role;
}


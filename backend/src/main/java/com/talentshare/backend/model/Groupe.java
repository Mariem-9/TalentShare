package com.talentshare.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groupes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Groupe {
    public enum GroupStatus {
        PENDING, // default
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupStatus status = GroupStatus.PENDING;


    @Column(nullable = false)
    private String nom;

    private String description;

    @ManyToOne
    @JoinColumn(name = "createur_id", nullable = false)
    private User createur;

    @ElementCollection
    @CollectionTable(name = "groupe_tags", joinColumns = @JoinColumn(name = "groupe_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_file_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private FileEntity avatar;
    @JsonProperty("avatarUrl")
    public String getAvatarUrl() {
        if (avatar != null && avatar.getId() != null) {
            return "/api/files/" + avatar.getId();
        }
        return null;
    }

    @OneToMany(mappedBy = "groupe", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FileEntity> fichiers = new HashSet<>();

    @OneToMany(mappedBy = "groupe", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GroupeMembre> membres = new HashSet<>();
}

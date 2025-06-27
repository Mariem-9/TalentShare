package com.talentshare.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String description;

    @ManyToOne
    @JoinColumn(name = "createur_id", nullable = false)
//    @JsonManagedReference
    private User createur;

    @ElementCollection
    @CollectionTable(name = "groupe_tags", joinColumns = @JoinColumn(name = "groupe_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    private String imageUrl;
//    @OneToMany(mappedBy = "groupe", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<FileEntity> files = new HashSet<>();

    @OneToMany(mappedBy = "groupe", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GroupeMembre> membres = new HashSet<>();
}

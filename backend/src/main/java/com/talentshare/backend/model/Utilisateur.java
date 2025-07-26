package com.talentshare.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Utilisateur {
    @Id
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    private String nom;
    private String email;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_file_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private FileEntity avatar;

    private String location;

    @Column(length = 500)
    private String bio;

    @ElementCollection
    @CollectionTable(name = "utilisateur_talents", joinColumns = @JoinColumn(name = "utilisateur_id"))
    @Column(name = "talent")
    private Set<String> talents = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "utilisateur_skills", joinColumns = @JoinColumn(name = "utilisateur_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "utilisateur_languages", joinColumns = @JoinColumn(name = "utilisateur_id"))
    @Column(name = "language")
    private List<String> languages = new ArrayList<>();




}





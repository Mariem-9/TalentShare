package com.talentshare.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String avatarUrl;
//    @OneToMany(mappedBy = "groupe", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<FileEntity> files = new HashSet<>();
}





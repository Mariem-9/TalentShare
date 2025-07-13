package com.talentshare.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String storagePath;
    private String fileType;
    private Long size;
    private boolean isPrivate = false;

    @ManyToOne
    @JoinColumn(name = "groupe_id")
    private Groupe groupe;

    @OneToOne(mappedBy = "avatar")
    @JsonIgnore
    private Utilisateur utilisateur;

    @OneToOne(mappedBy = "avatar")
    @JsonIgnore
    private Groupe groupeAvatar;
}

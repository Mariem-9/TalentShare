package com.talentshare.backend.repository;

import com.talentshare.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import com.talentshare.backend.model.User;


import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByUser_Username(String username);
    Optional<Utilisateur> findByUser(User user);

}


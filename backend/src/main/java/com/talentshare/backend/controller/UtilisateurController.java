package com.talentshare.backend.controller;

import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/utilisateur")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @GetMapping("/me")
    public ResponseEntity<Utilisateur> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return utilisateurRepository.findByUser_Username(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}


package com.talentshare.backend.controller;

import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.KeywordMappingRepository;
import com.talentshare.backend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


import java.security.Principal;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/utilisateur")
public class UtilisateurController {

    @Autowired
    private  UtilisateurService utilisateurService;
    @Autowired
    private KeywordMappingRepository keywordMappingRepository;


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(utilisateurService.getCurrentUserProfile(principal.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Utilisateur updatedUser, Principal principal) {
        utilisateurService.updateCurrentUserProfile(principal.getName(), updatedUser);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully."));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getGroupRecommendations(Principal principal) {
        return ResponseEntity.ok(utilisateurService.getGroupRecommendations(principal.getName()));
    }

    @GetMapping("/talents")
    public List<String> getTalentKeywords() {
        List<String> categories = List.of("music", "sports", "art","photography","writing",
            "entrepreneurship","volunteering");
        return keywordMappingRepository.findAll().stream()
            .filter(k -> categories.contains(k.getKeyword().toLowerCase()))
            .flatMap(k -> k.getRelatedKeywords().stream())
            .distinct()
            .toList();
    }

    @GetMapping("/skills")
    public List<String> getSkillKeywords() {
        List<String> categories = List.of("programming", "design", "communication","marketing",
            "education","technology","finance");
        return keywordMappingRepository.findAll().stream()
            .filter(k -> categories.contains(k.getKeyword().toLowerCase()))
            .flatMap(k -> k.getRelatedKeywords().stream())
            .distinct()
            .toList();
    }

    @GetMapping("/languages")
    public List<String> getLanguageKeywords() {
        List<String> categories = List.of("language");
        return keywordMappingRepository.findAll().stream()
            .filter(k -> categories.contains(k.getKeyword().toLowerCase()))
            .flatMap(k -> k.getRelatedKeywords().stream())
            .distinct()
            .toList();
    }
}


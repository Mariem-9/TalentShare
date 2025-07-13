package com.talentshare.backend.service;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.User;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.UserRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UserRepository userRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final GroupeRepository groupeRepository;

    public Map<String, Object> getCurrentUserProfile(String username) {
        Utilisateur utilisateur = utilisateurRepository.findByUser_Username(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("nom", utilisateur.getNom());
        profile.put("email", utilisateur.getEmail());
        profile.put("avatarUrl", utilisateur.getAvatar() != null
                ? "/api/files/" + utilisateur.getAvatar().getId()
                : null);
        profile.put("location", utilisateur.getLocation());
        profile.put("bio", utilisateur.getBio());
        profile.put("talents", utilisateur.getTalents());
        profile.put("skills", utilisateur.getSkills());
        profile.put("languages", utilisateur.getLanguages());

        return profile;
    }

    public void updateCurrentUserProfile(String username, Utilisateur updatedUser) {
        Utilisateur utilisateur = utilisateurRepository.findByUser_Username(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (updatedUser.getNom() != null) utilisateur.setNom(updatedUser.getNom());
        if (updatedUser.getLocation() != null) utilisateur.setLocation(updatedUser.getLocation());
        if (updatedUser.getBio() != null) utilisateur.setBio(updatedUser.getBio());
        if (updatedUser.getTalents() != null) utilisateur.setTalents(updatedUser.getTalents());
        if (updatedUser.getSkills() != null) utilisateur.setSkills(updatedUser.getSkills());
        if (updatedUser.getLanguages() != null) utilisateur.setLanguages(updatedUser.getLanguages());

        utilisateurRepository.save(utilisateur);
    }


    public List<Groupe> getGroupRecommendations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Utilisateur utilisateur = utilisateurRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        Set<String> userTalents = utilisateur.getTalents();
        Set<String> userSkills = utilisateur.getSkills();
        List<String> userLanguages = utilisateur.getLanguages();

        Set<String> allUserKeywords = new HashSet<>();
        if (userTalents != null) allUserKeywords.addAll(userTalents);
        if (userSkills != null) allUserKeywords.addAll(userSkills);
        if (userLanguages != null) allUserKeywords.addAll(userLanguages);

        List<Groupe> allGroups = groupeRepository.findAll().stream()
                .filter(g -> g.getStatus() != Groupe.GroupStatus.PENDING && g.getStatus() != Groupe.GroupStatus.REJECTED)
                .filter(g -> g.getMembres() == null ||
                        g.getMembres().stream().noneMatch(m -> m.getUser().getUsername().equals(username)))
                .filter(g -> !g.getCreateur().getUsername().equals(username))
                .collect(Collectors.toList());

        // Si mots-clés renseignés, tenter des recommandations
        if (!allUserKeywords.isEmpty()) {
            List<Groupe> recommended = allGroups.stream()
                    .filter(g -> g.getTags() != null &&
                            !Collections.disjoint(g.getTags(), allUserKeywords))
                    .limit(6)
                    .collect(Collectors.toList());

            if (!recommended.isEmpty()) return recommended;
        }

        // Fallback
        Collections.shuffle(allGroups);
        return allGroups.stream().limit(5).collect(Collectors.toList());
    }

}

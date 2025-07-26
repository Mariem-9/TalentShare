package com.talentshare.backend.service;

import com.talentshare.backend.exception.BusinessException;
import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.KeywordMapping;
import com.talentshare.backend.model.User;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.KeywordMappingRepository;
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
    private final KeywordMappingRepository keywordMappingRepository;


    public Map<String, Object> getCurrentUserProfile(String username) {

        Utilisateur utilisateur = utilisateurRepository.findByUser_Username(username)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

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
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

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
                .orElseThrow(() -> new BusinessException("User not found"));
        Utilisateur utilisateur = utilisateurRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException("User profile not found"));

        Set<String> userTalents = utilisateur.getTalents();
        Set<String> userSkills = utilisateur.getSkills();
        List<String> userLanguages = utilisateur.getLanguages();

        Set<String> allUserKeywords = new HashSet<>();
        if (userTalents != null) allUserKeywords.addAll(userTalents);
        if (userSkills != null) allUserKeywords.addAll(userSkills);
        if (userLanguages != null) allUserKeywords.addAll(userLanguages);
        System.out.println("User keywords: " + allUserKeywords);

        Set<String> cleanUserKeywords = new HashSet<>();
        for (String raw : allUserKeywords) {
            if (raw == null) continue;
            // Split by comma, semicolon, colon, and trim spaces
            String[] parts = raw.split("[,;:]");
            for (String part : parts) {
                String keyword = part.trim().toLowerCase();
                if (!keyword.isEmpty() && keyword.length() > 1) {
                    cleanUserKeywords.add(keyword);
                }
            }
        }
        System.out.println("Cleaned user keywords: " + cleanUserKeywords);

        // Load all KeywordMappings from DB
        List<KeywordMapping> keywordMappings = keywordMappingRepository.findAll();
        System.out.println("Loaded keyword mappings: " + keywordMappings);

        // Create a map for fast lookup: keyword -> related keywords
        Map<String, Set<String>> keywordToRelated = keywordMappings.stream()
            .collect(Collectors.toMap(
                km -> km.getKeyword().toLowerCase(),
                km -> km.getRelatedKeywords().stream().map(String::toLowerCase).collect(Collectors.toSet())
            ));

        // Expand user keywords by adding related keywords if they exist in the map
        Set<String> expandedUserKeywords = new HashSet<>();
        for (String keyword : cleanUserKeywords) {  // <-- use cleanUserKeywords here
            String lowerKeyword = keyword.toLowerCase();
            expandedUserKeywords.add(lowerKeyword);
            if (keywordToRelated.containsKey(lowerKeyword)) {
                expandedUserKeywords.addAll(keywordToRelated.get(lowerKeyword));
            }
        }

        List<Groupe> allGroups = groupeRepository.findAll().stream()
                .filter(g -> g.getStatus() != Groupe.GroupStatus.PENDING && g.getStatus() != Groupe.GroupStatus.REJECTED)
                .filter(g -> g.getMembres() == null ||
                        g.getMembres().stream().noneMatch(m -> m.getUser().getUsername().equals(username)))
                .filter(g -> !g.getCreateur().getUsername().equals(username))
                .collect(Collectors.toList());

//        if (!allUserKeywords.isEmpty()) {
//            List<Groupe> recommended = allGroups.stream()
//                    .filter(g -> g.getTags() != null &&
//                            !Collections.disjoint(g.getTags(), allUserKeywords))
//                    .limit(6)
//                    .collect(Collectors.toList());
//
//            if (!recommended.isEmpty()) return recommended;
//        }
        if (!expandedUserKeywords.isEmpty()) {
            List<Groupe> recommended = allGroups.stream()
                .peek(g -> {
                Set<String> groupTags = g.getTags() == null ? Collections.emptySet() :
                    g.getTags().stream().map(String::toLowerCase).collect(Collectors.toSet());
                System.out.println("Group '" + g.getNom() + "' tags: " + groupTags);
            })
                .filter(g -> g.getTags() != null &&
                    !Collections.disjoint(
                        g.getTags().stream().map(String::toLowerCase).collect(Collectors.toSet()),
                        expandedUserKeywords))

                .limit(6)
                .collect(Collectors.toList());

            System.out.println("Recommended groups found: " + recommended.size());

            if (!recommended.isEmpty()) return recommended;
        }

        // Fallback
        Collections.shuffle(allGroups);
        return allGroups.stream().limit(5).collect(Collectors.toList());
    }

}

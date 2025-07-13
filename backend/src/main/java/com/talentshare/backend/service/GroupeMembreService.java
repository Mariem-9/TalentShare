package com.talentshare.backend.service;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.GroupeMembre;
import com.talentshare.backend.model.User;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.GroupeMembreRepository;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.UserRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GroupeMembreService {
    private final GroupeRepository groupeRepository;
    private final UserRepository userRepository;
    private final GroupeMembreRepository groupeMembreRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AuditLogService auditLogService;
    private final HttpServletRequest request;

    public void joinGroup(Long groupId, String username) {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (groupeMembreRepository.existsByGroupeAndUser(groupe, user)) {
            throw new RuntimeException("Already a member or request pending.");
        }
        // Création d'une demande d'adhésion en attente
        GroupeMembre demande = new GroupeMembre(null, groupe, user, GroupeMembre.RoleGroupe.EN_ATTENTE);
        groupeMembreRepository.save(demande);
        auditLogService.log("JOIN_GROUP_REQUEST", "User " + username + " requested to join group " + groupId, request);
    }

    public void validerDemande(Long groupId, Integer userId, boolean accepte) {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String validateurUsername;
        if (principal instanceof UserDetails) {
            validateurUsername = ((UserDetails) principal).getUsername();
        } else {
            validateurUsername = principal.toString();
        }

        User validateur = userRepository.findByUsername(validateurUsername)
                .orElseThrow(() -> new RuntimeException("Validator not found"));

        // Vérifie le rôle du validateur
        GroupeMembre role = groupeMembreRepository.findByGroupeAndUser(groupe, validateur)
                .orElseThrow(() -> new RuntimeException("Validator is not in the group"));

        if (role.getRole() != GroupeMembre.RoleGroupe.CREATEUR &&
                role.getRole() != GroupeMembre.RoleGroupe.MODERATEUR) {
            throw new RuntimeException("You are not authorized to validate requests.");
        }

        // Valider ou refuser la demande
        User userToValidate = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to validate not found"));
        GroupeMembre demande = groupeMembreRepository.findByGroupeAndUser(groupe, userToValidate)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        if (demande.getRole() != GroupeMembre.RoleGroupe.EN_ATTENTE) {
            throw new RuntimeException("This is not a pending request.");
        }

        if (accepte) {
            demande.setRole(GroupeMembre.RoleGroupe.MEMBRE);
            groupeMembreRepository.save(demande);
        } else {
            groupeMembreRepository.delete(demande);
        }
        String action = accepte ? "ACCEPT_JOIN_REQUEST" : "REJECT_JOIN_REQUEST";
        String details = "Validator " + validateurUsername + " " + (accepte ? "accepted" : "rejected") + " user " + userId + " for group " + groupId;
        auditLogService.log(action, details, request);
    }


    public void leaveGroup(Long groupId, String username) {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        GroupeMembre membre = groupeMembreRepository.findByGroupeAndUser(groupe, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are not a member of this group"));

        if (membre.getRole() == GroupeMembre.RoleGroupe.CREATEUR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator cannot leave the group.");
        }

        groupeMembreRepository.delete(membre);
        auditLogService.log("LEAVE_GROUP", "User " + username + " left group " + groupId, request);
    }

    public String getMembershipStatus(Long groupId, String username) {
        Optional<GroupeMembre> membreOpt = groupeMembreRepository.findByGroupeIdAndUserUsername(groupId, username);

        if (membreOpt.isPresent()) {
            GroupeMembre membre = membreOpt.get();
            if (membre.getRole() == GroupeMembre.RoleGroupe.MEMBRE || membre.getRole() == GroupeMembre.RoleGroupe.MODERATEUR || membre.getRole() == GroupeMembre.RoleGroupe.CREATEUR) {
                return "MEMBER";
            } else if (membre.getRole() == GroupeMembre.RoleGroupe.EN_ATTENTE) {
                return "PENDING";
            }
        }

        return "NONE";
    }
//    public Map<String, List<User>> getMembersGroupedByRole(Long groupId) {
//        Groupe groupe = groupeRepository.findById(groupId)
//                .orElseThrow(() -> new RuntimeException("Group not found"));
//
//        List<GroupeMembre> membres = groupeMembreRepository.findByGroupe(groupe);
//
//        Map<String, List<User>> result = new HashMap<>();
//
//        for (GroupeMembre membre : membres) {
//            String roleKey = membre.getRole().name().toLowerCase(); // e.g. "createur", "membre", "en_attente"
//            result.computeIfAbsent(roleKey, k -> new ArrayList<>()).add(membre.getUser());
//        }
//
//        return result;
//    }
public Map<String, List<Map<String, Object>>> getMembersGroupedByRole(Long groupId) {
    Groupe groupe = groupeRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

    List<GroupeMembre> membres = groupeMembreRepository.findByGroupe(groupe);

    Map<String, List<Map<String, Object>>> result = new HashMap<>();
//    membres.stream().map(membre -> {
//        return membre;
//    }).collect();
    for (GroupeMembre membre : membres) {
        User user = membre.getUser();

        Utilisateur utilisateur = utilisateurRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable pour user " + user.getUsername()));

        // Prepare user data map
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", utilisateur.getId());
        userData.put("username", user.getUsername());
        userData.put("email", utilisateur.getEmail());

        // Avatar URL if present
        if (utilisateur.getAvatar() != null) {
            userData.put("avatarUrl", "/api/files/" + utilisateur.getAvatar().getId());
        } else {
            userData.put("avatarUrl", null);
        }

        // Role key (lowercase string of the role enum)
        String roleKey = membre.getRole().name().toLowerCase();

        result.computeIfAbsent(roleKey, k -> new ArrayList<>()).add(userData);
    }

    return result;

}
    public void promoteToModerator(Long groupId, Integer userId) {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User userToPromote = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Authentifié = créateur ?
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        GroupeMembre promoteur = groupeMembreRepository.findByGroupeAndUser(groupe,
                        userRepository.findByUsername(username).orElseThrow())
                .orElseThrow();

        if (promoteur.getRole() != GroupeMembre.RoleGroupe.CREATEUR)
            throw new RuntimeException("Only creator can promote");

        GroupeMembre membre = groupeMembreRepository.findByGroupeAndUser(groupe, userToPromote)
                .orElseThrow(() -> new RuntimeException("User is not a member"));

        if (membre.getRole() != GroupeMembre.RoleGroupe.MEMBRE)
            throw new RuntimeException("Only members can be promoted");

        membre.setRole(GroupeMembre.RoleGroupe.MODERATEUR);
        groupeMembreRepository.save(membre);
        auditLogService.log("PROMOTE_MODERATOR", "User " + userId + " promoted to MODERATOR in group " + groupId, request);
    }
    public void demoteModeratorToMember(Long groupId, Integer userId) {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        User validateur = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Validator not found"));

        // Vérifie que le validateur est bien createur
        GroupeMembre validateurRole = groupeMembreRepository.findByGroupeAndUser(groupe, validateur)
                .orElseThrow(() -> new RuntimeException("Validator not in group"));

        if (validateurRole.getRole() != GroupeMembre.RoleGroupe.CREATEUR) {
            throw new RuntimeException("You are not authorized to demote moderators.");
        }

        // Trouve le modérateur à rétrograder
        User userToDemote = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroupeMembre membre = groupeMembreRepository.findByGroupeAndUser(groupe, userToDemote)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (membre.getRole() != GroupeMembre.RoleGroupe.MODERATEUR) {
            throw new RuntimeException("User is not a moderator.");
        }

        // Change le rôle en membre
        membre.setRole(GroupeMembre.RoleGroupe.MEMBRE);
        groupeMembreRepository.save(membre);
        auditLogService.log("DEMOTE_MODERATOR", "User " + userId + " demoted to MEMBER in group " + groupId, request);
    }


}
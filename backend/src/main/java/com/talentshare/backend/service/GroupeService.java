package com.talentshare.backend.service;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.GroupeMembre;
import com.talentshare.backend.model.User;
import com.talentshare.backend.repository.GroupeMembreRepository;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupeService {

    private final GroupeRepository groupeRepository;
    private final UserRepository userRepository;
    private final GroupeMembreRepository groupeMembreRepository;
    private final AuditLogService auditLogService;

    public Groupe createGroupe(Groupe groupe, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        groupe.setCreateur(user);
        groupe.setStatus(Groupe.GroupStatus.PENDING);
//        return groupeRepository.save(groupe);
        Groupe savedGroupe = groupeRepository.save(groupe);

        // Ajouter le créateur comme membre avec rôle CREATEUR
        GroupeMembre membre = new GroupeMembre();
        membre.setGroupe(savedGroupe);
        membre.setUser(user);
        membre.setRole(GroupeMembre.RoleGroupe.CREATEUR);

        groupeMembreRepository.save(membre);

        return savedGroupe;
    }

    public boolean isUserCreator(Long groupId, String username) {
        Groupe groupe = groupeRepository.findById(groupId).orElse(null);
        return groupe != null && groupe.getCreateur().getUsername().equals(username);
    }


    public List<Groupe> getAllGroupes() {
//        return groupeRepository.findAll();
        return groupeRepository.findByStatus(Groupe.GroupStatus.APPROVED);
    }
    public List<Groupe> getPendingGroups() {
//        return groupeRepository.findAll();
        return groupeRepository.findByStatus(Groupe.GroupStatus.PENDING);
    }
    public Groupe validerGroupe(Long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId)
                .orElseThrow(() -> new RuntimeException("Groupe introuvable"));
        groupe.setStatus(Groupe.GroupStatus.APPROVED);
        return groupeRepository.save(groupe);
    }

    public Groupe refuserGroupe(Long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId)
                .orElseThrow(() -> new RuntimeException("Groupe introuvable"));
        groupe.setStatus(Groupe.GroupStatus.REJECTED);
        return groupeRepository.save(groupe);
    }

    public List<Groupe> getPendingGroupsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return groupeRepository.findByCreateurAndStatus(user, Groupe.GroupStatus.PENDING);
    }

    public Optional<Groupe> getGroupeById(Long id) {
        return groupeRepository.findById(id);
    }

    public Groupe updateGroupe(Long id, Groupe updatedGroupe, String username) {
        Groupe groupe = groupeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Groupe introuvable"));

        if (!groupe.getCreateur().getUsername().equals(username)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier ce groupe");
        }

        groupe.setNom(updatedGroupe.getNom());
        groupe.setDescription(updatedGroupe.getDescription());
        groupe.setTags(updatedGroupe.getTags());

        return groupeRepository.save(groupe);
    }

    public void deleteGroupe(Long id, String username) {
        Groupe groupe = groupeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Groupe introuvable"));

        if (!groupe.getCreateur().getUsername().equals(username)) {
            throw new RuntimeException("Suppression non autorisée");
        }

        groupeRepository.delete(groupe);
    }
    public List<Groupe> getGroupesCreesPar(String username) {
        return groupeRepository.findByCreateurUsernameAndStatus(username, Groupe.GroupStatus.APPROVED);
//        return groupeRepository.findAll().stream()
//                .filter(g -> g.getCreateur().getUsername().equals(username))
//                .toList();
    }

    public List<Groupe> getGroupesRejointsPar(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getGroupesRejoints().stream()
                .map(GroupeMembre::getGroupe)   // get the group from membership
                .filter(groupe -> !groupe.getCreateur().getUsername().equals(username)) // exclude if creator
                .distinct()
                .toList();
    }


}


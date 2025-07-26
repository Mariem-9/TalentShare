package com.talentshare.backend.service;

import com.talentshare.backend.exception.BusinessException;
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

    public Groupe createGroupe(Groupe groupe, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));
        groupe.setCreateur(user);
        groupe.setStatus(Groupe.GroupStatus.PENDING);
        Groupe savedGroupe = groupeRepository.save(groupe);
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
        return groupeRepository.findByStatus(Groupe.GroupStatus.APPROVED);
    }
    public List<Groupe> getPendingGroups() {
        return groupeRepository.findByStatus(Groupe.GroupStatus.PENDING);
    }
    public Groupe validerGroupe(Long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId)
                .orElseThrow(() -> new BusinessException("Groupe introuvable"));
        groupe.setStatus(Groupe.GroupStatus.APPROVED);
        return groupeRepository.save(groupe);
    }

    public Groupe refuserGroupe(Long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId)
                .orElseThrow(() -> new BusinessException("Groupe introuvable"));
        groupe.setStatus(Groupe.GroupStatus.REJECTED);
        return groupeRepository.save(groupe);
    }

    public List<Groupe> getPendingGroupsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));
        return groupeRepository.findByCreateurAndStatus(user, Groupe.GroupStatus.PENDING);
    }

    public Optional<Groupe> getGroupeById(Long id) {
        return groupeRepository.findById(id);
    }

    public Groupe updateGroupe(Long id, Groupe updatedGroupe, String username) {
        Groupe groupe = groupeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Groupe introuvable"));

        if (!groupe.getCreateur().getUsername().equals(username)) {
            throw new BusinessException("Vous n'êtes pas autorisé à modifier ce groupe");
        }

        groupe.setNom(updatedGroupe.getNom());
        groupe.setDescription(updatedGroupe.getDescription());
        groupe.setTags(updatedGroupe.getTags());

        return groupeRepository.save(groupe);
    }

    public void deleteGroupe(Long id, String username) {
        Groupe groupe = groupeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Groupe introuvable"));

        if (!groupe.getCreateur().getUsername().equals(username)) {
            throw new BusinessException("Suppression non autorisée");
        }

        groupeRepository.delete(groupe);
    }
    public List<Groupe> getGroupesCreesPar(String username) {
        return groupeRepository.findByCreateurUsernameAndStatus(username, Groupe.GroupStatus.APPROVED);
    }

    public List<Groupe> getGroupesRejointsPar(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        return user.getGroupesRejoints().stream()
                .map(GroupeMembre::getGroupe)
                .filter(groupe -> !groupe.getCreateur().getUsername().equals(username))
                .distinct()
                .toList();
    }


}


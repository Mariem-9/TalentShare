package com.talentshare.backend.service;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.GroupeMembre;
import com.talentshare.backend.model.User;
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

    public Groupe createGroupe(Groupe groupe, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        groupe.setCreateur(user);
        return groupeRepository.save(groupe);
    }

    public List<Groupe> getAllGroupes() {
        return groupeRepository.findAll();
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
        groupe.setImageUrl(updatedGroupe.getImageUrl());
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
        return groupeRepository.findAll().stream()
                .filter(g -> g.getCreateur().getUsername().equals(username))
                .toList();
    }

    public List<Groupe> getGroupesRejointsPar(String username) {
        return userRepository.findByUsername(username)
                .map(User::getGroupesRejoints)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .stream()
                .map(GroupeMembre::getGroupe)
                .distinct()
                .toList();
    }

}


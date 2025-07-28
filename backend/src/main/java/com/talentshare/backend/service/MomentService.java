package com.talentshare.backend.service;

import com.talentshare.backend.exception.BusinessException;
import com.talentshare.backend.model.*;
import com.talentshare.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MomentService {

    private final MomentRepository momentRepository;
    private final GroupeRepository groupeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final FileRepository fileRepository;

    @Transactional
    public Moment publierMoment(String texte, Long groupeId, Long fileId, String username) {
        Groupe groupe = groupeRepository.findById(groupeId)
            .orElseThrow(() -> new BusinessException("Groupe introuvable"));

        Utilisateur auteur = utilisateurRepository.findByUser_Username(username)
            .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        FileEntity media = null;
        if (fileId != null) {
            media = fileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException("Fichier introuvable"));
        }

        Moment moment = new Moment();
        moment.setTexte(texte);
        moment.setGroupe(groupe);
        moment.setAuteur(auteur);
        moment.setMedia(media);
        moment.setPublic(false);
        moment.setApprovedByCreator(false);

        return momentRepository.save(moment);
    }

    public List<Moment> getMomentsDuGroupe(Long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId)
            .orElseThrow(() -> new BusinessException("Groupe introuvable"));

        return momentRepository.findByGroupe(groupe);
    }

    public List<Moment> getMomentsPublics() {
        return momentRepository.findByIsPublicTrueAndIsApprovedByCreatorTrue();
    }
    @Transactional
    public Moment editMoment(Long momentId, String newTexte, Long mediaId, String username) {
        Moment moment = momentRepository.findById(momentId)
            .orElseThrow(() -> new BusinessException("Moment introuvable"));

        if (!moment.getAuteur().getUser().getUsername().equals(username)) {
            throw new BusinessException("Vous n'êtes pas autorisé à modifier ce moment");
        }

        moment.setTexte(newTexte);

        if (mediaId != null) {
            FileEntity media = fileRepository.findById(mediaId)
                .orElseThrow(() -> new BusinessException("Media introuvable"));
            moment.setMedia(media);
        } else {
            moment.setMedia(null);
        }

        return momentRepository.save(moment);
    }


    @Transactional
    public void deleteMoment(Long momentId, String username) {
        Moment moment = momentRepository.findById(momentId)
            .orElseThrow(() -> new BusinessException("Moment introuvable"));

        if (!moment.getAuteur().getUser().getUsername().equals(username)) {
            throw new BusinessException("Vous n'êtes pas autorisé à supprimer ce moment");
        }

        momentRepository.delete(moment);
    }

}


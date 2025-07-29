package com.talentshare.backend.service;

import com.talentshare.backend.exception.BusinessException;
import com.talentshare.backend.model.Commentaire;
import com.talentshare.backend.model.Moment;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.CommentaireRepository;
import com.talentshare.backend.repository.MomentRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentaireRepository commentaireRepository;
    private final MomentRepository momentRepository;
    private final UtilisateurRepository utilisateurRepository;

    public List<Commentaire> getCommentsByMoment(Long momentId) {
        Moment moment = momentRepository.findById(momentId)
            .orElseThrow(() -> new BusinessException("Moment introuvable"));

        return moment.getCommentaires().stream()
            .sorted(Comparator.comparing(Commentaire::getDateCommentaire).reversed())
            .collect(Collectors.toList());
    }

    public Commentaire addComment(Long momentId, String contenu, String username) {
        if (contenu == null || contenu.trim().isEmpty()) {
            throw new BusinessException("Le contenu du commentaire ne peut pas être vide");
        }

        Moment moment = momentRepository.findById(momentId)
            .orElseThrow(() -> new BusinessException("Moment introuvable"));

        Utilisateur auteur = utilisateurRepository.findByUser_Username(username)
            .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        Commentaire commentaire = new Commentaire();
        commentaire.setMoment(moment);
        commentaire.setAuteur(auteur);
        commentaire.setContenu(contenu);
        commentaire.setDateCommentaire(LocalDateTime.now());

        return commentaireRepository.save(commentaire);
    }

    public Commentaire updateComment(Long commentId, String newContent, String username) {
        Commentaire commentaire = commentaireRepository.findById(commentId)
            .orElseThrow(() -> new BusinessException("Commentaire introuvable"));

        if (!commentaire.getAuteur().getUser().getUsername().equals(username)) {
            throw new BusinessException("Vous ne pouvez modifier que vos propres commentaires.");
        }

        commentaire.setContenu(newContent);
        return commentaireRepository.save(commentaire);
    }

    public void deleteComment(Long commentId, String username) {
        Commentaire commentaire = commentaireRepository.findById(commentId)
            .orElseThrow(() -> new BusinessException("Commentaire introuvable"));

        if (!commentaire.getAuteur().getUser().getUsername().equals(username)) {
            throw new BusinessException("Vous ne pouvez supprimer que vos propres commentaires.");
        }

        commentaireRepository.delete(commentaire);
    }


}


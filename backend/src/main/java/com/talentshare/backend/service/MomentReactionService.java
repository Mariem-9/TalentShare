package com.talentshare.backend.service;

import com.talentshare.backend.DTOs.MomentReactionDTO;
import com.talentshare.backend.model.Moment;
import com.talentshare.backend.model.MomentReaction;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.MomentReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MomentReactionService {

    @Autowired
    private MomentReactionRepository reactionRepository;

    public MomentReactionDTO reactToMoment(Utilisateur utilisateur, Moment moment, String reactionTypeStr) {
        MomentReaction.ReactionType reactionType;
        try {
            reactionType = MomentReaction.ReactionType.valueOf(reactionTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid reaction type: " + reactionTypeStr);
        }

        Optional<MomentReaction> existingReaction = reactionRepository.findByUtilisateurAndMoment(utilisateur, moment);
        MomentReaction savedReaction;
        if (existingReaction.isPresent()) {
            MomentReaction reaction = existingReaction.get();
            reaction.setType(reactionType);
            savedReaction = reactionRepository.save(reaction);
        } else {
            MomentReaction newReaction = new MomentReaction(null, reactionType, utilisateur, moment);
            savedReaction = reactionRepository.save(newReaction);
        }

        return new MomentReactionDTO(savedReaction);
    }
    public void removeReaction(Utilisateur user, Moment moment) {
        reactionRepository.findByUtilisateurAndMoment(user, moment)
            .ifPresent(reactionRepository::delete);
    }

    public List<MomentReactionDTO> getReactionsForMoment(Moment moment) {
        return reactionRepository.findByMoment(moment).stream()
            .map(MomentReactionDTO::new)
            .toList();
    }
}

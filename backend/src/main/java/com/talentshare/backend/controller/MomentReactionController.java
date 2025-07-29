package com.talentshare.backend.controller;

import com.talentshare.backend.DTOs.MomentReactionDTO;
import com.talentshare.backend.model.Moment;
import com.talentshare.backend.model.MomentReaction;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.service.MomentReactionService;
import com.talentshare.backend.repository.MomentRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/moments/{momentId}/reactions")
public class MomentReactionController {

    @Autowired
    private MomentReactionService reactionService;

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @PostMapping
    public MomentReactionDTO reactToMoment(@PathVariable Long momentId,
                                           @RequestParam String reaction,
                                           Principal principal) {
        Utilisateur user = utilisateurRepository.findByUser_Username(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Moment moment = momentRepository.findById(momentId)
            .orElseThrow(() -> new RuntimeException("Moment not found"));

        return reactionService.reactToMoment(user, moment, reaction);
    }

    @GetMapping
    public List<MomentReactionDTO> getReactions(@PathVariable Long momentId) {
        Moment moment = momentRepository.findById(momentId)
            .orElseThrow(() -> new RuntimeException("Moment not found"));

        return reactionService.getReactionsForMoment(moment);
    }
    @DeleteMapping
    public void removeReaction(@PathVariable Long momentId, Principal principal) {
        Utilisateur user = utilisateurRepository.findByUser_Username(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Moment moment = momentRepository.findById(momentId)
            .orElseThrow(() -> new RuntimeException("Moment not found"));

        reactionService.removeReaction(user, moment);
    }

}


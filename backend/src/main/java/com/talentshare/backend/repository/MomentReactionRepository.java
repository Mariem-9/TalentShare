package com.talentshare.backend.repository;

import com.talentshare.backend.model.MomentReaction;
import com.talentshare.backend.model.Moment;
import com.talentshare.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MomentReactionRepository extends JpaRepository<MomentReaction, Long> {
    Optional<MomentReaction> findByMomentAndUtilisateur(Moment moment, Utilisateur utilisateur);
}


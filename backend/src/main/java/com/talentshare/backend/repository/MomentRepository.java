package com.talentshare.backend.repository;

import com.talentshare.backend.model.Moment;
import com.talentshare.backend.model.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MomentRepository extends JpaRepository<Moment, Long> {
    List<Moment> findByGroupe(Groupe groupe);
    List<Moment> findByIsPublicTrueAndIsApprovedByCreatorTrue();
}


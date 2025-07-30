package com.talentshare.backend.repository;

import com.talentshare.backend.model.Moment;
import com.talentshare.backend.model.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MomentRepository extends JpaRepository<Moment, Long> {
    List<Moment> findByGroupe(Groupe groupe);
    @Query("SELECT m FROM Moment m LEFT JOIN FETCH m.media WHERE m.isPublic = true AND m.isApprovedByCreator = true")
    List<Moment> findByIsPublicTrueAndIsApprovedByCreatorTrueWithMedia();

}


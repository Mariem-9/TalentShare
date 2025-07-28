package com.talentshare.backend.repository;

import com.talentshare.backend.model.Commentaire;
import com.talentshare.backend.model.Moment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByMoment(Moment moment);
}


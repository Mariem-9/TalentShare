package com.talentshare.backend.repository;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.GroupeMembre;
import com.talentshare.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface GroupeMembreRepository extends JpaRepository<GroupeMembre, Long> {

    Optional<GroupeMembre> findByGroupeAndUser(Groupe groupe, User user);

    List<GroupeMembre> findByGroupe(Groupe groupe);

    List<GroupeMembre> findByUser(User user);

    boolean existsByGroupeAndUser(Groupe groupe, User user);
}

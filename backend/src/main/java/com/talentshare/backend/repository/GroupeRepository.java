package com.talentshare.backend.repository;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {
    List<Groupe> findByCreateur_Username(String username);
    List<Groupe> findByStatus(Groupe.GroupStatus status);
    List<Groupe> findByCreateurUsernameAndStatus(String username, Groupe.GroupStatus status);
    List<Groupe> findByCreateurAndStatus(User user, Groupe.GroupStatus status);
}

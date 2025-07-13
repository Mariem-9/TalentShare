package com.talentshare.backend.controller;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.service.GroupeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/groupes")
@RequiredArgsConstructor
public class GroupeController {

    private final GroupeService groupeService;


    @PostMapping
    public ResponseEntity<Groupe> createGroupe(@RequestBody Groupe groupe, Principal principal) {
        return ResponseEntity.ok(groupeService.createGroupe(groupe, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Groupe>> getAllGroupes() {
        return ResponseEntity.ok(groupeService.getAllGroupes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Groupe> getGroupeById(@PathVariable Long id) {
        return groupeService.getGroupeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/is-creator")
    public ResponseEntity<Boolean> isUserGroupCreator(@PathVariable Long id, Principal principal) {
        boolean isCreator = groupeService.isUserCreator(id, principal.getName());
        return ResponseEntity.ok(isCreator);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Groupe> updateGroupe(@PathVariable Long id, @RequestBody Groupe groupe, Principal principal) {
        return ResponseEntity.ok(groupeService.updateGroupe(id, groupe, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupe(@PathVariable Long id, Principal principal) {
        groupeService.deleteGroupe(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/crees")
    public ResponseEntity<List<Groupe>> getGroupesCrees(Principal principal) {
        return ResponseEntity.ok(groupeService.getGroupesCreesPar(principal.getName()));
    }

    @GetMapping("/rejoints")
    public ResponseEntity<List<Groupe>> getGroupesRejoints(Principal principal) {
        return ResponseEntity.ok(groupeService.getGroupesRejointsPar(principal.getName()));
    }

    @GetMapping("/pending")
    public List<Groupe> getPendingGroupsForCurrentUser(Principal principal) {
        return groupeService.getPendingGroupsForUser(principal.getName());
    }


}


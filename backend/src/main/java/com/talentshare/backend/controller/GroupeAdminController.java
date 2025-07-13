package com.talentshare.backend.controller;

import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.service.GroupeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/groupes")
@PreAuthorize("hasRole('ADMIN')")
public class GroupeAdminController {

    @Autowired
    private GroupeService groupeService;

    @GetMapping
    public ResponseEntity<List<Groupe>> getPendingGroups() {
        return ResponseEntity.ok(groupeService.getPendingGroups());
    }


    @PutMapping("/{id}/approve")
    public ResponseEntity<Groupe> approveGroupe(@PathVariable Long id) {
        return ResponseEntity.ok(groupeService.validerGroupe(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Groupe> rejectGroupe(@PathVariable Long id) {
        return ResponseEntity.ok(groupeService.refuserGroupe(id));
    }
}


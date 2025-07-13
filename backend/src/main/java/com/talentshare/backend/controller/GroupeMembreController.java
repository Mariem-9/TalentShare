package com.talentshare.backend.controller;

import com.talentshare.backend.service.GroupeMembreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupeMembreController {
    private final GroupeMembreService groupeMembreService;
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinGroup(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        groupeMembreService.joinGroup(id, userDetails.getUsername());
        return ResponseEntity.ok(Collections.singletonMap("message", "Joined group successfully."));

    }
    @PostMapping("/{id}/requests/{userId}/validate")
    public ResponseEntity<?> validerDemande(@PathVariable Long id,
                                            @PathVariable Integer userId,
                                            @RequestParam boolean accepte) {
        groupeMembreService.validerDemande(id, userId, accepte);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Demande " + (accepte ? "acceptée" : "refusée"));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leaveGroup(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        groupeMembreService.leaveGroup(id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Left group successfully."));
    }

    @GetMapping("/{groupId}/membership-status")
    public ResponseEntity<Map<String, String>> getMembershipStatus(@PathVariable Long groupId, Principal principal) {
        String username = principal.getName();
        String status = groupeMembreService.getMembershipStatus(groupId, username);

        Map<String, String> response = new HashMap<>();
        response.put("status", status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/members-by-role")
    public ResponseEntity<?> getMembersByRole(@PathVariable Long id) {
        return ResponseEntity.ok(groupeMembreService.getMembersGroupedByRole(id));
    }
    @PostMapping("/{groupId}/promote/{userId}")
    public ResponseEntity<?> promoteToModerator(@PathVariable Long groupId, @PathVariable Integer userId) {
        groupeMembreService.promoteToModerator(groupId, userId);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{groupId}/demote/{userId}")
    public ResponseEntity<Void> demoteModeratorToMember(@PathVariable Long groupId, @PathVariable Integer userId) {
        groupeMembreService.demoteModeratorToMember(groupId, userId);
        return ResponseEntity.ok().build();
    }






}

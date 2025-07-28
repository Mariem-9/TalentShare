package com.talentshare.backend.controller;

import com.talentshare.backend.model.Moment;
import com.talentshare.backend.service.MomentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/moments")
@RequiredArgsConstructor
public class MomentController {

    private final MomentService momentService;

    @PostMapping("/publish")
    public ResponseEntity<Moment> publierMoment(
        @RequestParam String texte,
        @RequestParam Long groupeId,
        @RequestParam(required = false) Long mediaFileId,
        Principal principal) {
        System.out.println("Received mediaFileId: " + mediaFileId);

        Moment moment = momentService.publierMoment(texte, groupeId, mediaFileId, principal.getName());
        return ResponseEntity.ok(moment);
    }

    @GetMapping("/group/{groupeId}")
    public ResponseEntity<List<Moment>> getMomentsDuGroupe(@PathVariable Long groupeId) {
        List<Moment> moments = momentService.getMomentsDuGroupe(groupeId);
        return ResponseEntity.ok(moments);
    }

    @GetMapping("/public")
    public ResponseEntity<List<Moment>> getMomentsPublics() {
        List<Moment> momentsPublics = momentService.getMomentsPublics();
        return ResponseEntity.ok(momentsPublics);
    }

    public static class MomentEditRequest {
        public String texte;
        public Long mediaId;
    }

    @PutMapping("/{momentId}")
    public ResponseEntity<Moment> editMoment(
        @PathVariable Long momentId,
        @RequestBody MomentEditRequest request,
        Principal principal) {

        Moment updatedMoment = momentService.editMoment(momentId, request.texte, request.mediaId, principal.getName());
        return ResponseEntity.ok(updatedMoment);
    }


    @DeleteMapping("/{momentId}")
    public ResponseEntity<Void> deleteMoment(
        @PathVariable Long momentId,
        Principal principal) {

        momentService.deleteMoment(momentId, principal.getName());
        return ResponseEntity.noContent().build();
    }

}


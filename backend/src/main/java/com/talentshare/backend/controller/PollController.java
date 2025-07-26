package com.talentshare.backend.controller;

import com.talentshare.backend.DTOs.PollRequest;
import com.talentshare.backend.DTOs.PollResponse;
import com.talentshare.backend.service.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/polls")
@RequiredArgsConstructor
public class PollController {

    private final PollService pollService;

    @PostMapping("/create")
    public ResponseEntity<PollResponse> createPoll(@RequestBody PollRequest request, Principal principal) {
        PollResponse pollResponse = pollService.createPoll(
                request.getQuestion(),
                request.getEndDate(),
                request.getChoices(),
                request.getGroupId(),
                principal.getName()
        );
        return ResponseEntity.ok(pollResponse);
    }

    @PostMapping("/{pollId}/vote")
    public ResponseEntity<Void> vote(@PathVariable Long pollId,
                                     @RequestParam Long choiceId,
                                     Principal principal) {
        pollService.vote(pollId, choiceId, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{pollId}")
    public ResponseEntity<PollResponse> getResults(@PathVariable Long pollId, Principal principal) {
        PollResponse pollResponse = pollService.getPollWithResults(pollId, principal.getName());
        return ResponseEntity.ok(pollResponse);
    }

    @GetMapping("/group/{groupId}/closed")
    public ResponseEntity<List<PollResponse>> getClosedPolls(@PathVariable Long groupId) {
        List<PollResponse> closedPolls = pollService.getClosedPollsByGroup(groupId);
        return ResponseEntity.ok(closedPolls);
    }


    @PutMapping("/{pollId}/edit")
    public ResponseEntity<PollResponse> editPoll(@PathVariable Long pollId,
                                                 @RequestBody PollRequest updatedRequest,
                                                 Principal principal) {
        PollResponse updatedPoll = pollService.editPoll(pollId, updatedRequest, principal.getName());
        return ResponseEntity.ok(updatedPoll);
    }

    @DeleteMapping("/{pollId}")
    public ResponseEntity<Void> deletePoll(@PathVariable Long pollId, Principal principal) {
        pollService.deletePoll(pollId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/choices/{choiceId}/edit")
    public ResponseEntity<Void> editChoice(@PathVariable Long choiceId,
                                           @RequestParam String newText,
                                           Principal principal) {
        pollService.editPollChoice(choiceId, newText, principal.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/choices/{choiceId}")
    public ResponseEntity<Void> deleteChoice(@PathVariable Long choiceId, Principal principal) {
        pollService.deletePollChoice(choiceId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{pollId}/vote/edit")
    public ResponseEntity<Void> editVote(@PathVariable Long pollId,
                                         @RequestParam Long newChoiceId,
                                         Principal principal) {
        pollService.editVote(pollId, newChoiceId, principal.getName());
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{pollId}/vote")
    public ResponseEntity<Void> deleteVote(@PathVariable Long pollId, Principal principal) {
        pollService.deleteVote(pollId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<PollResponse>> getPollsByGroup(@PathVariable Long groupId) {
        List<PollResponse> polls = pollService.getPollsByGroup(groupId);
        return ResponseEntity.ok(polls);
    }



}

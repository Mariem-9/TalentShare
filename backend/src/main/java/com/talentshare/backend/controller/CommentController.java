package com.talentshare.backend.controller;

import com.talentshare.backend.model.Commentaire;
import com.talentshare.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moments/{momentId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public List<Commentaire> getComments(@PathVariable Long momentId) {
        return commentService.getCommentsByMoment(momentId);
    }

    @PostMapping
    public Commentaire addComment(@PathVariable Long momentId, @RequestBody Map<String, String> body, Principal principal) {
        String contenu = body.get("contenu");
        return commentService.addComment(momentId, contenu, principal.getName());
    }

    @PutMapping("/{commentId}")
    public Commentaire updateComment(@PathVariable Long momentId, @PathVariable Long commentId,
                                     @RequestBody Map<String, String> body, Principal principal) {
        return commentService.updateComment(commentId, body.get("contenu"), principal.getName());
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long momentId, @PathVariable Long commentId, Principal principal) {
        commentService.deleteComment(commentId, principal.getName());
    }

}

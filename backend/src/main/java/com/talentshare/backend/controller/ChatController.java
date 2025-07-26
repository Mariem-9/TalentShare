package com.talentshare.backend.controller;

import com.talentshare.backend.model.ChatMessage;
import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.MessageRepository;
import com.talentshare.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
public class ChatController {
    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat.send/{groupId}")
    @SendTo("/topic/group/{groupId}")
    public ChatMessage sendMessage(
            @Payload String content,
            @DestinationVariable Long groupId,
            Principal principal
    ) {

        return chatService.processIncomingMessage(
                principal.getName(),
                groupId,
                content
        );
    }

    @GetMapping("/api/group/{groupId}/messages")
    public ResponseEntity<List<ChatMessage>> getGroupMessages(@PathVariable Long groupId) {
        return ResponseEntity.ok(chatService.getGroupMessages(groupId));
    }

    @PutMapping("/api/message/{messageId}")
    public ResponseEntity<ChatMessage> editMessage(
        @PathVariable Long messageId,
        @RequestBody String newContent,
        Principal principal) {

        ChatMessage updatedMessage = chatService.editMessage(messageId, principal.getName(), newContent);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("/api/message/{messageId}")
    public ResponseEntity<Void> deleteMessage(
        @PathVariable Long messageId,
        Principal principal) {

        chatService.deleteMessage(messageId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

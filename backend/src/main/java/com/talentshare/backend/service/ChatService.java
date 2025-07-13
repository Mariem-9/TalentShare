package com.talentshare.backend.service;

import com.talentshare.backend.model.*;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.MessageRepository;
import com.talentshare.backend.repository.UserRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor  // Use Lombok to auto-inject dependencies
public class ChatService {
    private final UserRepository userRepository;
    private final GroupeRepository groupeRepository;
    private final MessageRepository messageRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AuditLogService auditLogService;

    // Handle new messages
    public ChatMessage processIncomingMessage(String username, Long groupId, String content ) {
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // 1. Save to database
        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setGroupe(groupe);
        message.setTimestamp(LocalDateTime.now());
        Message savedMessage = messageRepository.save(message);

        auditLogService.log("SEND_CHAT_MESSAGE",
                "User " + username + " sent message in group " + groupId,
                null);
        
        // 2. Convert to DTO
        return mapToChatMessage(savedMessage);
    }

    // Fetch message history
    public List<ChatMessage> getGroupMessages(Long groupId) {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return messageRepository.findByGroupeOrderByTimestampAsc(groupe).stream()
                .map(this::mapToChatMessage)
                .toList();
    }

    // Reusable mapping logic
    private ChatMessage mapToChatMessage(Message message) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setGroupId(message.getGroupe().getId());
        chatMessage.setSenderUsername(message.getSender().getUsername());
        chatMessage.setContent(message.getContent());
        chatMessage.setTimestamp(message.getTimestamp());

        // Set avatar URL if exists
        utilisateurRepository.findByUser(message.getSender())
                .map(Utilisateur::getAvatar)
                .ifPresent(avatar ->
                        chatMessage.setSenderAvatarUrl("/api/files/" + avatar.getId())
                );

        return chatMessage;
    }
}


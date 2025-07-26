package com.talentshare.backend.service;

import com.talentshare.backend.exception.BusinessException;
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

    public ChatMessage processIncomingMessage(String username, Long groupId, String content ) {
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() ->  new BusinessException("User not found"));
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new BusinessException("Group not found"));

        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setGroupe(groupe);
        message.setTimestamp(LocalDateTime.now());
        Message savedMessage = messageRepository.save(message);

        auditLogService.log("SEND_CHAT_MESSAGE",
                "User " + username + " sent message in group " + groupId,
                null);

        return mapToChatMessage(savedMessage);
    }

    public List<ChatMessage> getGroupMessages(Long groupId) {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new BusinessException("Group not found"));

        return messageRepository.findByGroupeOrderByTimestampAsc(groupe).stream()
                .map(this::mapToChatMessage)
                .toList();
    }

    private ChatMessage mapToChatMessage(Message message) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setId(message.getId());
        chatMessage.setGroupId(message.getGroupe().getId());
        chatMessage.setSenderUsername(message.getSender().getUsername());
        chatMessage.setContent(message.getContent());
        chatMessage.setTimestamp(message.getTimestamp());

        utilisateurRepository.findByUser(message.getSender())
                .map(Utilisateur::getAvatar)
                .ifPresent(avatar ->
                        chatMessage.setSenderAvatarUrl("/api/files/" + avatar.getId())
                );

        return chatMessage;
    }

    public ChatMessage editMessage(Long messageId, String username, String newContent) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new BusinessException("Message not found"));

        if (!message.getSender().getUsername().equals(username)) {
            throw new BusinessException("You can only edit your own messages");
        }

        message.setContent(newContent);
        message.setTimestamp(LocalDateTime.now()); // optionally update timestamp on edit
        Message updatedMessage = messageRepository.save(message);

        auditLogService.log("EDIT_CHAT_MESSAGE",
            "User " + username + " edited message " + messageId,
            null);

        return mapToChatMessage(updatedMessage);
    }

    public void deleteMessage(Long messageId, String username) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new BusinessException("Message not found"));

        if (!message.getSender().getUsername().equals(username)) {
            throw new BusinessException("You can only delete your own messages");
        }

        messageRepository.delete(message);

        auditLogService.log("DELETE_CHAT_MESSAGE",
            "User " + username + " deleted message " + messageId,
            null);
    }
}


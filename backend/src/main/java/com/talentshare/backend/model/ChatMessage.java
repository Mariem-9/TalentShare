package com.talentshare.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long id;
    private Long groupId;
    private String senderUsername;
    private String senderAvatarUrl;
    private String content;
    private LocalDateTime timestamp;
}

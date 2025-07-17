package com.talentshare.backend.DTOs;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PollRequest {
    private String question;
    private LocalDateTime endDate;
    private List<String> choices;
    private Long groupId;
}

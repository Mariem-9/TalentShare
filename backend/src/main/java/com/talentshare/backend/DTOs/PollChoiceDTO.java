package com.talentshare.backend.DTOs;

public record PollChoiceDTO(
        Long id,
        String text,
        int voteCount
) {}

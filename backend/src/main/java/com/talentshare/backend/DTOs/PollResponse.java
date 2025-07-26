package com.talentshare.backend.DTOs;

import java.time.LocalDateTime;
import java.util.List;

public record PollResponse(
        Long id,
        String question,
        LocalDateTime endDate,
        List<PollChoiceDTO> choices,
        Long votedChoiceId
) {}


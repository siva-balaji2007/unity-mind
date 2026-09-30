package com.unitymind.chat.dto;

import java.util.List;
import java.util.UUID;

public record ChatResponse(
        UUID sessionId,
        String answer,
        List<String> sources
) {
}

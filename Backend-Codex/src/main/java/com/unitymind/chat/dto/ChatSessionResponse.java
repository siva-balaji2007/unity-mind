package com.unitymind.chat.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChatSessionResponse(
        UUID id,
        String title,
        Instant createdAt,
        List<ChatMessageResponse> messages
) {
}

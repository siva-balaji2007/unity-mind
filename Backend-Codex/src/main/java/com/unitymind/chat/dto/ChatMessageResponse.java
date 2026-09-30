package com.unitymind.chat.dto;

import com.unitymind.common.ChatRole;

import java.time.Instant;
import java.util.UUID;

public record ChatMessageResponse(
        UUID id,
        ChatRole role,
        String content,
        Instant createdAt
) {
}

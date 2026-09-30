package com.unitymind.chat;

import com.unitymind.chat.dto.ChatMessageResponse;
import com.unitymind.chat.dto.ChatSessionResponse;

public final class ChatMapper {
    private ChatMapper() {
    }

    public static ChatMessageResponse toMessageResponse(ChatMessage message) {
        return new ChatMessageResponse(message.getId(), message.getRole(), message.getContent(), message.getCreatedAt());
    }

    public static ChatSessionResponse toSessionResponse(ChatSession session) {
        return new ChatSessionResponse(
                session.getId(),
                session.getTitle(),
                session.getCreatedAt(),
                session.getMessages().stream().map(ChatMapper::toMessageResponse).toList()
        );
    }
}

package com.unitymind.chat;

import com.unitymind.chat.dto.ChatRequest;
import com.unitymind.chat.dto.ChatResponse;
import com.unitymind.chat.dto.ChatSessionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping("/api/projects/{id}/chat")
    public ChatResponse chat(@PathVariable UUID id, @Valid @RequestBody ChatRequest request) {
        return chatService.chat(id, request);
    }

    @GetMapping("/api/projects/{id}/chat/sessions")
    public List<ChatSessionResponse> sessions(@PathVariable UUID id) {
        return chatService.sessions(id);
    }

    @GetMapping("/api/chat/sessions/{id}")
    public ChatSessionResponse session(@PathVariable UUID id) {
        return chatService.session(id);
    }
}

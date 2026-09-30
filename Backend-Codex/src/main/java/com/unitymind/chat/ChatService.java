package com.unitymind.chat;

import com.unitymind.chat.dto.ChatRequest;
import com.unitymind.chat.dto.ChatResponse;
import com.unitymind.chat.dto.ChatSessionResponse;
import com.unitymind.common.ChatRole;
import com.unitymind.common.ResourceType;
import com.unitymind.embedding.Embedding;
import com.unitymind.embedding.EmbeddingService;
import com.unitymind.embedding.OpenAIClientService;
import com.unitymind.exception.ProjectNotFoundException;
import com.unitymind.prefab.PrefabRepository;
import com.unitymind.project.Project;
import com.unitymind.project.ProjectService;
import com.unitymind.scene.SceneRepository;
import com.unitymind.script.ScriptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ProjectService projectService;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final EmbeddingService embeddingService;
    private final OpenAIClientService openAIClientService;
    private final ScriptRepository scriptRepository;
    private final SceneRepository sceneRepository;
    private final PrefabRepository prefabRepository;

    @Transactional
    public ChatResponse chat(UUID projectId, ChatRequest request) {
        Project project = projectService.getOwnedProject(projectId);
        ChatSession session = resolveSession(project, request);
        List<Embedding> relevant = embeddingService.nearest(project, request.message(), 8);
        List<String> contextBlocks = relevant.stream().map(this::contextFor).filter(text -> !text.isBlank()).toList();
        List<String> sources = relevant.stream().map(this::sourceFor).filter(text -> !text.isBlank()).distinct().toList();
        List<Map<String, String>> history = chatMessageRepository.findTop12BySessionIdOrderByCreatedAtDesc(session.getId()).stream()
                .sorted(Comparator.comparing(ChatMessage::getCreatedAt))
                .map(message -> Map.of(
                        "role", message.getRole() == ChatRole.USER ? "user" : "assistant",
                        "content", message.getContent()
                ))
                .toList();

        chatMessageRepository.save(ChatMessage.builder()
                .session(session)
                .role(ChatRole.USER)
                .content(request.message())
                .build());

        String answer = openAIClientService.answer(systemPrompt(project, contextBlocks), history, request.message());

        chatMessageRepository.save(ChatMessage.builder()
                .session(session)
                .role(ChatRole.ASSISTANT)
                .content(answer)
                .build());

        return new ChatResponse(session.getId(), answer, sources);
    }

    @Transactional(readOnly = true)
    public List<ChatSessionResponse> sessions(UUID projectId) {
        Project project = projectService.getOwnedProject(projectId);
        return chatSessionRepository.findAllByProjectIdOrderByCreatedAtDesc(project.getId()).stream()
                .map(ChatMapper::toSessionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatSessionResponse session(UUID sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ProjectNotFoundException("Chat session not found"));
        projectService.getOwnedProject(session.getProject().getId());
        return ChatMapper.toSessionResponse(session);
    }

    private ChatSession resolveSession(Project project, ChatRequest request) {
        if (request.sessionId() != null) {
            return chatSessionRepository.findById(request.sessionId())
                    .filter(session -> session.getProject().getId().equals(project.getId()))
                    .orElseThrow(() -> new ProjectNotFoundException("Chat session not found"));
        }
        String title = request.message().length() <= 80 ? request.message() : request.message().substring(0, 80);
        return chatSessionRepository.save(ChatSession.builder().project(project).title(title).build());
    }

    private String systemPrompt(Project project, List<String> contextBlocks) {
        return """
                You are UnityMind, an AI companion for Unity developers.
                Answer using only the retrieved Unity project context and normal Unity/C# reasoning.
                Do not claim access to the entire project. If context is insufficient, say what is missing.

                Project: %s
                Unity version: %s

                Retrieved context:
                %s
                """.formatted(project.getName(), project.getUnityVersion(), String.join("\n\n---\n\n", contextBlocks));
    }

    private String contextFor(Embedding embedding) {
        if (embedding.getResourceType() == ResourceType.SCRIPT) {
            return scriptRepository.findById(embedding.getResourceId())
                    .map(script -> "SCRIPT " + script.getPath() + "\n" + script.getContent())
                    .orElse("");
        }
        if (embedding.getResourceType() == ResourceType.SCENE) {
            return sceneRepository.findById(embedding.getResourceId())
                    .map(scene -> "SCENE " + scene.getPath() + "\nName: " + scene.getName())
                    .orElse("");
        }
        return prefabRepository.findById(embedding.getResourceId())
                .map(prefab -> "PREFAB " + prefab.getPath() + "\nName: " + prefab.getName())
                .orElse("");
    }

    private String sourceFor(Embedding embedding) {
        if (embedding.getResourceType() == ResourceType.SCRIPT) {
            return scriptRepository.findById(embedding.getResourceId()).map(script -> script.getPath()).orElse("");
        }
        if (embedding.getResourceType() == ResourceType.SCENE) {
            return sceneRepository.findById(embedding.getResourceId()).map(scene -> scene.getPath()).orElse("");
        }
        return prefabRepository.findById(embedding.getResourceId()).map(prefab -> prefab.getPath()).orElse("");
    }
}

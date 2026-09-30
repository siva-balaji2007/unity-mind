package com.unitymind.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    List<ChatSession> findAllByProjectIdOrderByCreatedAtDesc(UUID projectId);

    Optional<ChatSession> findByIdAndProjectUserId(UUID id, UUID userId);
}

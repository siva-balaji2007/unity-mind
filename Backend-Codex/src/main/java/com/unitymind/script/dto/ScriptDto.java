package com.unitymind.script.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.UUID;

public record ScriptDto(
        UUID id,
        @NotBlank String name,
        @NotBlank String path,
        String content,
        Instant createdAt,
        Instant updatedAt
) {
}

package com.unitymind.project.dto;

import com.unitymind.project.ProjectFileType;

import java.time.Instant;
import java.util.UUID;

public record ProjectFileDto(
        UUID id,
        String name,
        ProjectFileType type,
        String path,
        long size,
        Instant uploadedAt,
        Instant indexedAt
) {
}

package com.unitymind.project.dto;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String name,
        String unityVersion,
        int filesUploaded,
        int filesIndexed,
        Instant lastUploadedAt,
        Instant createdAt,
        Instant updatedAt,
        ProjectStatsDto stats
) {
    public ProjectResponse(UUID id, String name, String unityVersion, int filesUploaded, int filesIndexed, Instant lastUploadedAt, Instant createdAt, Instant updatedAt) {
        this(id, name, unityVersion, filesUploaded, filesIndexed, lastUploadedAt, createdAt, updatedAt, null);
    }
}

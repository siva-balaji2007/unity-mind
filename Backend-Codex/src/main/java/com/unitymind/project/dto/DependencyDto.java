package com.unitymind.project.dto;

import com.unitymind.common.DependencyRelationshipType;
import com.unitymind.common.ResourceType;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record DependencyDto(
        UUID id,
        @NotNull ResourceType sourceType,
        @NotNull UUID sourceId,
        @NotNull ResourceType targetType,
        @NotNull UUID targetId,
        @NotNull DependencyRelationshipType relationshipType
) {
}

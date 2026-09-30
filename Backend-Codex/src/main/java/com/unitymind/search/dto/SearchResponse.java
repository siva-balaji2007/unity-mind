package com.unitymind.search.dto;

import com.unitymind.common.ResourceType;

import java.util.UUID;

public record SearchResponse(
        ResourceType resourceType,
        UUID resourceId,
        String name,
        String path,
        String snippet,
        double score
) {
}

package com.unitymind.project.dto;

public record ProjectStatsDto(
        long scripts,
        long scenes,
        long prefabs,
        long dependencies
) {
}

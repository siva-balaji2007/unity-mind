package com.unitymind.project.dto;

public record SyncProjectResponse(
        int scriptsIndexed,
        int scenesIndexed,
        int prefabsIndexed,
        int dependenciesIndexed
) {
}

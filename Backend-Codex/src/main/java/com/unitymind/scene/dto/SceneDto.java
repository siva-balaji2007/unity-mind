package com.unitymind.scene.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record SceneDto(
        UUID id,
        @NotBlank String name,
        @NotBlank String path
) {
}

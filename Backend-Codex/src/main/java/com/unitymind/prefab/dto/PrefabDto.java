package com.unitymind.prefab.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record PrefabDto(
        UUID id,
        @NotBlank String name,
        @NotBlank String path
) {
}

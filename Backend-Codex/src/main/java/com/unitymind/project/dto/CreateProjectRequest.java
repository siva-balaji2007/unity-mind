package com.unitymind.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
        @NotBlank @Size(max = 160) String name,
        @NotBlank @Size(max = 80) String unityVersion
) {
}

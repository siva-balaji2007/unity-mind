package com.unitymind.project;

import com.unitymind.project.dto.ProjectResponse;
import com.unitymind.project.dto.ProjectStatsDto;

public final class ProjectMapper {
    private ProjectMapper() {
    }

    public static ProjectResponse toResponse(Project project) {
        return toResponse(project, null);
    }

    public static ProjectResponse toResponse(Project project, ProjectStatsDto stats) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getUnityVersion(),
                project.getFilesUploaded(),
                project.getFilesIndexed(),
                project.getLastUploadedAt(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                stats
        );
    }
}

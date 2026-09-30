package com.unitymind.project;

import com.unitymind.common.ResourceType;
import com.unitymind.embedding.EmbeddingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectFileIndexingService {
    private final EmbeddingService embeddingService;
    private final ProjectFileRepository projectFileRepository;

    @Async
    @Transactional
    public void indexFileAsync(UUID projectFileId) {
        ProjectFile projectFile = projectFileRepository.findById(projectFileId)
                .orElseThrow(() -> new IllegalStateException("Project file not found for indexing: " + projectFileId));

        boolean alreadyIndexed = projectFile.getIndexedAt() != null;

        if (projectFile.getType() == ProjectFileType.META) {
            projectFile.setIndexedAt(Instant.now());
            projectFileRepository.save(projectFile);
            return;
        }

        if (projectFile.getType() == ProjectFileType.SCRIPT && projectFile.getContent() != null) {
            embeddingService.upsertEmbedding(
                    projectFile.getProject(),
                    ResourceType.SCRIPT,
                    projectFile.getId(),
                    "Script: " + projectFile.getPath() + "\n" + projectFile.getContent()
            );
        } else if (projectFile.getType() == ProjectFileType.SCENE) {
            embeddingService.upsertEmbedding(
                    projectFile.getProject(),
                    ResourceType.SCENE,
                    projectFile.getId(),
                    "Scene: " + projectFile.getPath()
            );
        } else if (projectFile.getType() == ProjectFileType.PREFAB) {
            embeddingService.upsertEmbedding(
                    projectFile.getProject(),
                    ResourceType.PREFAB,
                    projectFile.getId(),
                    "Prefab: " + projectFile.getPath()
            );
        }

        projectFile.setIndexedAt(Instant.now());
        projectFileRepository.save(projectFile);

        if (!alreadyIndexed) {
            Project project = projectFile.getProject();
            project.setFilesIndexed(project.getFilesIndexed() + 1);
        }
    }
}

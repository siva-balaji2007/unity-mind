package com.unitymind.project;

import com.unitymind.common.ResourceType;
import com.unitymind.embedding.EmbeddingService;
import com.unitymind.prefab.Prefab;
import com.unitymind.prefab.PrefabRepository;
import com.unitymind.prefab.dto.PrefabDto;
import com.unitymind.project.dto.DependencyDto;
import com.unitymind.project.dto.SyncProjectRequest;
import com.unitymind.project.dto.SyncProjectResponse;
import com.unitymind.scene.Scene;
import com.unitymind.scene.SceneRepository;
import com.unitymind.scene.dto.SceneDto;
import com.unitymind.script.Script;
import com.unitymind.script.ScriptRepository;
import com.unitymind.script.dto.ScriptDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectSyncService {
    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final ScriptRepository scriptRepository;
    private final SceneRepository sceneRepository;
    private final PrefabRepository prefabRepository;
    private final DependencyRepository dependencyRepository;
    private final EmbeddingService embeddingService;

    @Transactional
    public SyncProjectResponse sync(UUID projectId, SyncProjectRequest request) {
        Project project = projectService.getOwnedProject(projectId);
        Map<UUID, UUID> idMap = new HashMap<>();

        for (ScriptDto dto : request.scriptsOrEmpty()) {
            Script script = scriptRepository.findByProjectIdAndPath(projectId, dto.path())
                    .orElseGet(() -> Script.builder().project(project).path(dto.path()).build());
            script.setName(dto.name());
            script.setContent(dto.content() == null ? "" : dto.content());
            Script saved = scriptRepository.save(script);
            rememberId(idMap, dto.id(), saved.getId());
            embeddingService.upsertEmbedding(project, ResourceType.SCRIPT, saved.getId(), "Script: " + saved.getName() + "\nPath: " + saved.getPath() + "\n" + saved.getContent());
        }

        for (SceneDto dto : request.scenesOrEmpty()) {
            Scene scene = sceneRepository.findByProjectIdAndPath(projectId, dto.path())
                    .orElseGet(() -> Scene.builder().project(project).path(dto.path()).build());
            scene.setName(dto.name());
            Scene saved = sceneRepository.save(scene);
            rememberId(idMap, dto.id(), saved.getId());
            embeddingService.upsertEmbedding(project, ResourceType.SCENE, saved.getId(), "Scene: " + saved.getName() + "\nPath: " + saved.getPath());
        }

        for (PrefabDto dto : request.prefabsOrEmpty()) {
            Prefab prefab = prefabRepository.findByProjectIdAndPath(projectId, dto.path())
                    .orElseGet(() -> Prefab.builder().project(project).path(dto.path()).build());
            prefab.setName(dto.name());
            Prefab saved = prefabRepository.save(prefab);
            rememberId(idMap, dto.id(), saved.getId());
            embeddingService.upsertEmbedding(project, ResourceType.PREFAB, saved.getId(), "Prefab: " + saved.getName() + "\nPath: " + saved.getPath());
        }

        dependencyRepository.deleteAllByProjectId(projectId);
        for (DependencyDto dto : request.dependenciesOrEmpty()) {
            dependencyRepository.save(Dependency.builder()
                    .project(project)
                    .sourceType(dto.sourceType())
                    .sourceId(idMap.getOrDefault(dto.sourceId(), dto.sourceId()))
                    .targetType(dto.targetType())
                    .targetId(idMap.getOrDefault(dto.targetId(), dto.targetId()))
                    .relationshipType(dto.relationshipType())
                    .build());
        }

        project.setLastSyncAt(Instant.now());
        projectRepository.save(project);
        return new SyncProjectResponse(
                request.scriptsOrEmpty().size(),
                request.scenesOrEmpty().size(),
                request.prefabsOrEmpty().size(),
                request.dependenciesOrEmpty().size()
        );
    }

    private void rememberId(Map<UUID, UUID> idMap, UUID clientId, UUID savedId) {
        if (clientId != null) {
            idMap.put(clientId, savedId);
        }
    }
}

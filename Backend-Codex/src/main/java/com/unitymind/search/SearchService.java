package com.unitymind.search;

import com.unitymind.common.ResourceType;
import com.unitymind.embedding.Embedding;
import com.unitymind.embedding.EmbeddingService;
import com.unitymind.exception.OpenAIException;
import com.unitymind.prefab.Prefab;
import com.unitymind.prefab.PrefabRepository;
import com.unitymind.project.Project;
import com.unitymind.project.ProjectService;
import com.unitymind.scene.Scene;
import com.unitymind.scene.SceneRepository;
import com.unitymind.script.Script;
import com.unitymind.script.ScriptRepository;
import com.unitymind.search.dto.SearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final ProjectService projectService;
    private final ScriptRepository scriptRepository;
    private final SceneRepository sceneRepository;
    private final PrefabRepository prefabRepository;
    private final EmbeddingService embeddingService;

    @Transactional(readOnly = true)
    public List<SearchResponse> search(UUID projectId, String query) {
        Project project = projectService.getOwnedProject(projectId);
        List<SearchResponse> results = new ArrayList<>();
        scriptRepository.search(projectId, query, 8).forEach(script ->
                results.add(new SearchResponse(ResourceType.SCRIPT, script.getId(), script.getName(), script.getPath(), snippet(script.getContent()), 1.0)));
        sceneRepository.search(projectId, query, 5).forEach(scene ->
                results.add(new SearchResponse(ResourceType.SCENE, scene.getId(), scene.getName(), scene.getPath(), "", 0.8)));
        prefabRepository.search(projectId, query, 5).forEach(prefab ->
                results.add(new SearchResponse(ResourceType.PREFAB, prefab.getId(), prefab.getName(), prefab.getPath(), "", 0.8)));

        try {
            for (Embedding embedding : embeddingService.nearest(project, query, 8)) {
                toResponse(embedding).ifPresent(results::add);
            }
        } catch (OpenAIException ignored) {
            // Full-text search still works when OpenAI is not configured.
        }
        return results.stream().distinct().limit(20).toList();
    }

    public Optional<SearchResponse> toResponse(Embedding embedding) {
        if (embedding.getResourceType() == ResourceType.SCRIPT) {
            return scriptRepository.findById(embedding.getResourceId())
                    .map(script -> new SearchResponse(ResourceType.SCRIPT, script.getId(), script.getName(), script.getPath(), snippet(script.getContent()), 0.7));
        }
        if (embedding.getResourceType() == ResourceType.SCENE) {
            return sceneRepository.findById(embedding.getResourceId())
                    .map(scene -> new SearchResponse(ResourceType.SCENE, scene.getId(), scene.getName(), scene.getPath(), "", 0.7));
        }
        return prefabRepository.findById(embedding.getResourceId())
                .map(prefab -> new SearchResponse(ResourceType.PREFAB, prefab.getId(), prefab.getName(), prefab.getPath(), "", 0.7));
    }

    private String snippet(String content) {
        if (content == null || content.isBlank()) {
            return "";
        }
        return content.length() <= 260 ? content : content.substring(0, 260);
    }
}

package com.unitymind.embedding;

import com.unitymind.common.ResourceType;
import com.unitymind.project.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmbeddingService {
    private final OpenAIClientService openAIClientService;
    private final EmbeddingRepository embeddingRepository;

    @Transactional
    public void upsertEmbedding(Project project, ResourceType resourceType, UUID resourceId, String text) {
        String vector = toPgVector(openAIClientService.createEmbedding(trimForEmbedding(text)));
        Embedding embedding = embeddingRepository
                .findByProjectIdAndResourceTypeAndResourceId(project.getId(), resourceType, resourceId)
                .orElseGet(() -> Embedding.builder()
                        .project(project)
                        .resourceType(resourceType)
                        .resourceId(resourceId)
                        .build());
        embedding.setEmbeddingVector(vector);
        embeddingRepository.save(embedding);
    }

    @Transactional(readOnly = true)
    public List<Embedding> nearest(Project project, String query, int limit) {
        String vector = toPgVector(openAIClientService.createEmbedding(query));
        return embeddingRepository.findNearest(project.getId(), vector, limit);
    }

    private String trimForEmbedding(String text) {
        if (text == null) {
            return "";
        }
        return text.length() <= 12000 ? text : text.substring(0, 12000);
    }

    private String toPgVector(List<Double> vector) {
        return "[" + String.join(",", vector.stream().map(String::valueOf).toList()) + "]";
    }
}

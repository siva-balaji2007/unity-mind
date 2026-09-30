package com.unitymind.embedding;

import com.unitymind.common.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmbeddingRepository extends JpaRepository<Embedding, UUID> {
    Optional<Embedding> findByProjectIdAndResourceTypeAndResourceId(UUID projectId, ResourceType resourceType, UUID resourceId);

    @Modifying
    void deleteAllByProjectId(UUID projectId);

    @Query(value = """
            select * from embeddings e
            where e.project_id = :projectId
            order by e.embedding_vector <=> cast(:queryVector as vector)
            limit :limit
            """, nativeQuery = true)
    List<Embedding> findNearest(@Param("projectId") UUID projectId, @Param("queryVector") String queryVector, @Param("limit") int limit);
}

package com.unitymind.scene;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SceneRepository extends JpaRepository<Scene, UUID> {
    List<Scene> findAllByProjectIdOrderByPathAsc(UUID projectId);

    long countByProjectId(UUID projectId);

    Optional<Scene> findByProjectIdAndPath(UUID projectId, String path);

    @Query(value = """
            select * from scenes s
            where s.project_id = :projectId
              and (to_tsvector('english', s.name || ' ' || s.path) @@ plainto_tsquery('english', :query)
                   or lower(s.name) like lower(concat('%', :query, '%'))
                   or lower(s.path) like lower(concat('%', :query, '%')))
            limit :limit
            """, nativeQuery = true)
    List<Scene> search(@Param("projectId") UUID projectId, @Param("query") String query, @Param("limit") int limit);
}

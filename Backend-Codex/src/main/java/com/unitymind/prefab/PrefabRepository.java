package com.unitymind.prefab;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PrefabRepository extends JpaRepository<Prefab, UUID> {
    List<Prefab> findAllByProjectIdOrderByPathAsc(UUID projectId);

    long countByProjectId(UUID projectId);

    Optional<Prefab> findByProjectIdAndPath(UUID projectId, String path);

    @Query(value = """
            select * from prefabs p
            where p.project_id = :projectId
              and (to_tsvector('english', p.name || ' ' || p.path) @@ plainto_tsquery('english', :query)
                   or lower(p.name) like lower(concat('%', :query, '%'))
                   or lower(p.path) like lower(concat('%', :query, '%')))
            limit :limit
            """, nativeQuery = true)
    List<Prefab> search(@Param("projectId") UUID projectId, @Param("query") String query, @Param("limit") int limit);
}

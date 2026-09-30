package com.unitymind.script;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ScriptRepository extends JpaRepository<Script, UUID> {
    List<Script> findAllByProjectIdOrderByPathAsc(UUID projectId);

    long countByProjectId(UUID projectId);

    Optional<Script> findByIdAndProjectUserId(UUID id, UUID userId);

    Optional<Script> findByProjectIdAndPath(UUID projectId, String path);

    @Query(value = """
            select * from scripts s
            where s.project_id = :projectId
              and (to_tsvector('english', s.name || ' ' || s.path || ' ' || s.content) @@ plainto_tsquery('english', :query)
                   or lower(s.name) like lower(concat('%', :query, '%'))
                   or lower(s.path) like lower(concat('%', :query, '%')))
            order by ts_rank(to_tsvector('english', s.name || ' ' || s.path || ' ' || s.content), plainto_tsquery('english', :query)) desc
            limit :limit
            """, nativeQuery = true)
    List<Script> search(@Param("projectId") UUID projectId, @Param("query") String query, @Param("limit") int limit);
}

package com.unitymind.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DependencyRepository extends JpaRepository<Dependency, UUID> {
    List<Dependency> findAllByProjectId(UUID projectId);

    long countByProjectId(UUID projectId);

    void deleteAllByProjectId(UUID projectId);
}

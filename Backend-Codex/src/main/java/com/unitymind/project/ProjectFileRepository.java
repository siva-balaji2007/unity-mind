package com.unitymind.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, UUID> {
    List<ProjectFile> findAllByProjectId(UUID projectId);

    Optional<ProjectFile> findByProjectIdAndPath(UUID projectId, String path);
}

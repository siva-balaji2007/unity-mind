package com.unitymind.project;

import com.unitymind.exception.ProjectNotFoundException;
import com.unitymind.prefab.PrefabRepository;
import com.unitymind.project.dto.CreateProjectRequest;
import com.unitymind.project.dto.ProjectResponse;
import com.unitymind.project.dto.ProjectStatsDto;
import com.unitymind.scene.SceneRepository;
import com.unitymind.script.ScriptRepository;
import com.unitymind.security.CurrentUserService;
import com.unitymind.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final CurrentUserService currentUserService;
    private final ScriptRepository scriptRepository;
    private final SceneRepository sceneRepository;
    private final PrefabRepository prefabRepository;
    private final DependencyRepository dependencyRepository;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects() {
        User user = currentUserService.currentUser();
        return projectRepository.findAllByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
                .map(this::toResponseWithStats)
                .toList();
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        User user = currentUserService.currentUser();
        Project project = Project.builder()
                .name(request.name().trim())
                .unityVersion(request.unityVersion().trim())
                .user(user)
                .build();
        return toResponseWithStats(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public Project getOwnedProject(UUID projectId) {
        User user = currentUserService.currentUser();
        return projectRepository.findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID projectId) {
        return toResponseWithStats(getOwnedProject(projectId));
    }

    @Transactional
    public void deleteProject(UUID projectId) {
        Project project = getOwnedProject(projectId);
        projectRepository.delete(project);
    }

    public ProjectResponse toResponseWithStats(Project project) {
        long scripts = scriptRepository.countByProjectId(project.getId());
        long scenes = sceneRepository.countByProjectId(project.getId());
        long prefabs = prefabRepository.countByProjectId(project.getId());
        long dependencies = dependencyRepository.countByProjectId(project.getId());
        ProjectStatsDto stats = new ProjectStatsDto(scripts, scenes, prefabs, dependencies);
        return ProjectMapper.toResponse(project, stats);
    }
}

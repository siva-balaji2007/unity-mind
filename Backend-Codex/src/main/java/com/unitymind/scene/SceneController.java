package com.unitymind.scene;

import com.unitymind.project.Project;
import com.unitymind.project.ProjectService;
import com.unitymind.scene.dto.SceneDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{id}/scenes")
@RequiredArgsConstructor
public class SceneController {
    private final ProjectService projectService;
    private final SceneRepository sceneRepository;

    @GetMapping
    public List<SceneDto> getScenes(@PathVariable UUID id) {
        Project project = projectService.getOwnedProject(id);
        return sceneRepository.findAllByProjectIdOrderByPathAsc(project.getId()).stream()
                .map(SceneMapper::toDto)
                .toList();
    }
}

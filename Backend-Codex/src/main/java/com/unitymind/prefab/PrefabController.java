package com.unitymind.prefab;

import com.unitymind.prefab.dto.PrefabDto;
import com.unitymind.project.Project;
import com.unitymind.project.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{id}/prefabs")
@RequiredArgsConstructor
public class PrefabController {
    private final ProjectService projectService;
    private final PrefabRepository prefabRepository;

    @GetMapping
    public List<PrefabDto> getPrefabs(@PathVariable UUID id) {
        Project project = projectService.getOwnedProject(id);
        return prefabRepository.findAllByProjectIdOrderByPathAsc(project.getId()).stream()
                .map(PrefabMapper::toDto)
                .toList();
    }
}

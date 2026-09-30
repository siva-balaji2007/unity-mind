package com.unitymind.script;

import com.unitymind.project.Project;
import com.unitymind.project.ProjectService;
import com.unitymind.script.dto.ScriptDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ScriptController {
    private final ProjectService projectService;
    private final ScriptRepository scriptRepository;

    @GetMapping("/api/projects/{id}/scripts")
    public List<ScriptDto> getProjectScripts(@PathVariable UUID id) {
        Project project = projectService.getOwnedProject(id);
        return scriptRepository.findAllByProjectIdOrderByPathAsc(project.getId()).stream()
                .map(ScriptMapper::toDto)
                .toList();
    }

    @GetMapping("/api/scripts/{scriptId}")
    public ScriptDto getScript(@PathVariable UUID scriptId) {
        return scriptRepository.findById(scriptId)
                .filter(script -> {
                    projectService.getOwnedProject(script.getProject().getId());
                    return true;
                })
                .map(ScriptMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Script not found"));
    }
}

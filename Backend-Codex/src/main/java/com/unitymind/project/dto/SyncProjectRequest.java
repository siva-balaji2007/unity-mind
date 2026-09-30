package com.unitymind.project.dto;

import com.unitymind.prefab.dto.PrefabDto;
import com.unitymind.scene.dto.SceneDto;
import com.unitymind.script.dto.ScriptDto;
import jakarta.validation.Valid;

import java.util.List;

public record SyncProjectRequest(
        @Valid List<ScriptDto> scripts,
        @Valid List<SceneDto> scenes,
        @Valid List<PrefabDto> prefabs,
        @Valid List<DependencyDto> dependencies
) {
    public List<ScriptDto> scriptsOrEmpty() {
        return scripts == null ? List.of() : scripts;
    }

    public List<SceneDto> scenesOrEmpty() {
        return scenes == null ? List.of() : scenes;
    }

    public List<PrefabDto> prefabsOrEmpty() {
        return prefabs == null ? List.of() : prefabs;
    }

    public List<DependencyDto> dependenciesOrEmpty() {
        return dependencies == null ? List.of() : dependencies;
    }
}

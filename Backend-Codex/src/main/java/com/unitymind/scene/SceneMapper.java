package com.unitymind.scene;

import com.unitymind.scene.dto.SceneDto;

public final class SceneMapper {
    private SceneMapper() {
    }

    public static SceneDto toDto(Scene scene) {
        return new SceneDto(scene.getId(), scene.getName(), scene.getPath());
    }
}

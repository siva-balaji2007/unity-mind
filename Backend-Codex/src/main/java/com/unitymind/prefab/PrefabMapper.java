package com.unitymind.prefab;

import com.unitymind.prefab.dto.PrefabDto;

public final class PrefabMapper {
    private PrefabMapper() {
    }

    public static PrefabDto toDto(Prefab prefab) {
        return new PrefabDto(prefab.getId(), prefab.getName(), prefab.getPath());
    }
}

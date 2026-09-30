package com.unitymind.script;

import com.unitymind.script.dto.ScriptDto;

public final class ScriptMapper {
    private ScriptMapper() {
    }

    public static ScriptDto toDto(Script script) {
        return new ScriptDto(script.getId(), script.getName(), script.getPath(), script.getContent(), script.getCreatedAt(), script.getUpdatedAt());
    }
}

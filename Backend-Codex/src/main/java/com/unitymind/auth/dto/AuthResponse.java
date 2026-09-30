package com.unitymind.auth.dto;

import com.unitymind.user.dto.UserResponse;

public record AuthResponse(
        String token,
        UserResponse user
) {
}

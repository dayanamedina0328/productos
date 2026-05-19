package com.pos.backend.application.dto.response;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    String username,
    String role
) {
    public static AuthResponse of(String accessToken, String refreshToken,
                                  long expiresIn, String username, String role) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", expiresIn, username, role);
    }
}

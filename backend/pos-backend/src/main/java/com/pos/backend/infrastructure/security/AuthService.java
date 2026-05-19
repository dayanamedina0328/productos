package com.pos.backend.infrastructure.security;

import com.pos.backend.application.dto.request.LoginRequest;
import com.pos.backend.application.dto.request.RefreshTokenRequest;
import com.pos.backend.application.dto.response.AuthResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        List<String> roles = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(a -> a.replace("ROLE_", ""))
            .toList();

        String accessToken = jwtService.generateAccessToken(auth.getName(), roles);
        String refreshToken = jwtService.generateRefreshToken(auth.getName());

        return AuthResponse.of(accessToken, refreshToken,
                               jwtService.getAccessTokenExpiration(), auth.getName(),
                               roles.isEmpty() ? "USER" : roles.get(0));
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        String token = request.refreshToken();

        if (!jwtService.validateToken(token)) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        String username = jwtService.extractUsername(token);
        List<String> roles = jwtService.extractRoles(token);

        String newAccessToken = jwtService.generateAccessToken(username, roles);
        String newRefreshToken = jwtService.generateRefreshToken(username);

        return AuthResponse.of(newAccessToken, newRefreshToken,
                               jwtService.getAccessTokenExpiration(), username,
                               roles.isEmpty() ? "USER" : roles.get(0));
    }
}

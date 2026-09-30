package com.unitymind.auth;

import com.unitymind.auth.dto.AuthResponse;
import com.unitymind.auth.dto.LoginRequest;
import com.unitymind.auth.dto.RegisterRequest;
import com.unitymind.security.CurrentUserService;
import com.unitymind.security.JwtService;
import com.unitymind.user.User;
import com.unitymind.user.UserRepository;
import com.unitymind.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CurrentUserService currentUserService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }
        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .build();
        User saved = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(saved.getId(), saved.getEmail()), UserMapper.toResponse(saved));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password()));
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        return new AuthResponse(jwtService.generateToken(user.getId(), user.getEmail()), UserMapper.toResponse(user));
    }

    public AuthResponse me() {
        User user = currentUserService.currentUser();
        return new AuthResponse(null, UserMapper.toResponse(user));
    }
}

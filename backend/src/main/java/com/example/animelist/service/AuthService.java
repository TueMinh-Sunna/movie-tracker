package com.example.animelist.service;

import com.example.animelist.dto.AuthUserResponse;
import com.example.animelist.dto.LoginRequest;
import com.example.animelist.dto.RegisterRequest;
import com.example.animelist.entity.User;
import com.example.animelist.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class AuthService {

    private static final String SESSION_USER_ID = "userId";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthUserResponse register(RegisterRequest request, HttpSession session) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(BAD_REQUEST, "Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(BAD_REQUEST, "Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);

        session.setAttribute(SESSION_USER_ID, savedUser.getId());

        return toAuthUserResponse(savedUser);
    }

    public AuthUserResponse login(LoginRequest request, HttpSession session) {
        String usernameOrEmail = request.getUsernameOrEmail().trim();
        String password = request.getPassword();

        User user = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail.toLowerCase()))
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid username/email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid username/email or password");
        }

        session.setAttribute(SESSION_USER_ID, user.getId());

        return toAuthUserResponse(user);
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    public AuthUserResponse getCurrentUser(HttpSession session) {
        Object userIdObject = session.getAttribute(SESSION_USER_ID);

        if (userIdObject == null) {
            throw new ResponseStatusException(UNAUTHORIZED, "Not logged in");
        }

        Long userId = (Long) userIdObject;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "User not found"));

        return toAuthUserResponse(user);
    }

    private AuthUserResponse toAuthUserResponse(User user) {
        return new AuthUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
package com.talentshare.backend.controller;

import com.talentshare.backend.model.*;
import com.talentshare.backend.repository.PasswordResetTokenRepository;
import com.talentshare.backend.repository.UserRepository;
import com.talentshare.backend.service.EmailService;
import com.talentshare.backend.service.JwtUtil;
import io.jsonwebtoken.Jwts;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;


    @PostMapping("/authenticate")
    public ResponseEntity<?> generateToken(@RequestBody AuthRequest request) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception e) {
            throw new Exception("Invalid username/password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        final String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
        return ResponseEntity.ok(new AuthResponse(jwt,refreshToken, role));

    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        String role;
        if ("ROLE_ADMIN".equals(request.getRole())) {
            if (!"123456789".equals(request.getAdminCode())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid admin activation code"));
            }
            role = "ROLE_ADMIN";
        } else {
            role = "ROLE_USER";
        }


        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);

        Authority authority = new Authority();
        authority.setAuthority(request.getRole());
        authority.setUser(user);
        user.setAuthorities(Set.of(authority));

        userRepository.save(user);

        // Generate token after registration
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getAuthorities().stream()
                        .map(auth -> new SimpleGrantedAuthority(auth.getAuthority()))
                        .collect(Collectors.toList())
        );

        String jwt = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "username", user.getUsername(),
                "jwtToken", jwt,
                "refreshToken", refreshToken,
                "role", request.getRole()
        ));
    }
    @PostMapping("/refreshtoken")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token is missing"));
        }

        String refreshToken = authHeader.substring(7);

        try {
            if (!jwtUtil.validateRefreshToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired refresh token"));
            }

            String username = Jwts.parserBuilder()
                    .setSigningKey((jwtUtil.getRefreshSecretKey()))
                    .build()
                    .parseClaimsJws(refreshToken)
                    .getBody()
                    .getSubject();
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String newAccessToken = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Map.of(
                    "accessToken", newAccessToken,
                    "tokenType", "Bearer"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh failed: " + e.getMessage()));
        }
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User with this email not found"));
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusMinutes(15));
        passwordResetTokenRepository.save(resetToken);

        String resetUrl = "http://localhost:4200/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(email, resetUrl);

        return ResponseEntity.ok(Map.of("message", "Reset link sent to your email"));
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanExpiredTokens() {
        passwordResetTokenRepository.deleteAllByExpiryDateBefore(LocalDateTime.now());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid token"));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Token expired"));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }



}


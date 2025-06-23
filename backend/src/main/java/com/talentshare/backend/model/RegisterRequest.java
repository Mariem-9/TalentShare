package com.talentshare.backend.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String role; // "ROLE_USER" or "ROLE_ADMIN"
    private String adminCode;
}

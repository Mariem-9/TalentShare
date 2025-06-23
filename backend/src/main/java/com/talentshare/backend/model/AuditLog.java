package com.talentshare.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String action;
    private String details;
    private String ipAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

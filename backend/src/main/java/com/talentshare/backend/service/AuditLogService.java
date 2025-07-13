package com.talentshare.backend.service;
import com.talentshare.backend.model.AuditLog;
import com.talentshare.backend.model.User;
import com.talentshare.backend.repository.AuditLogRepository;
import com.talentshare.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    private UserRepository userRepository;

    public void log(String action, String details, HttpServletRequest request) {
        try {
//            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//            String username = auth != null ? auth.getName() : "SYSTEM";

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return;
            }

            String username = auth.getName();

            User user = userRepository.findByUsername(username).orElse(null);

            AuditLog log = new AuditLog();
            log.setUser(user);
            log.setAction(action);
            log.setDetails(details);
//            log.setIpAddress(request.getRemoteAddr());
            if (request != null) {
                log.setIpAddress(request.getRemoteAddr());
            } else {
                log.setIpAddress("SYSTEM");
            }

            log.setCreatedAt(LocalDateTime.now());

            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.printf("Failed to audit: %s - %s%n", action, e.getMessage());
        }
    }


//    @Scheduled(cron = "0 0 2 * * *") // tous les jours à 2h du matin
    @Scheduled(cron = "0 0 * * * *") // chaque heure
    @Transactional
    public void deleteOldLogs() {
        List<AuditLog> allLogs = auditLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        if (allLogs.size() > 10) {
            List<AuditLog> toDelete = allLogs.subList(10, allLogs.size());
            auditLogRepository.deleteAll(toDelete);
            System.out.println("[Audit] " + toDelete.size() + " anciens logs supprimés (max 10 gardés)");
        }
    }


}

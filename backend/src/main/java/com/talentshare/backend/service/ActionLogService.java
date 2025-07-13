package com.talentshare.backend.service;

import com.talentshare.backend.model.ActionLog;
import com.talentshare.backend.model.User;
import com.talentshare.backend.repository.ActionLogRepository;
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
public class ActionLogService {
    @Autowired
    private ActionLogRepository actionLogRepository;
    @Autowired private UserRepository userRepository;

    public void log(String action, String context, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) return;

        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        ActionLog log = new ActionLog();
        log.setUser(user);
        log.setAction(action);
        log.setContext(context);
        log.setIpAddress(request.getRemoteAddr());
        log.setCreatedAt(LocalDateTime.now());

        actionLogRepository.save(log);
    }
    public List<ActionLog> getAllLogs() {
        return actionLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Scheduled(cron = "0 0 2 * * *")  // Every day at 2 AM
    @Transactional
    public void deleteOldLogs() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(2);
        int deletedCount = actionLogRepository.deleteByCreatedAtBefore(cutoffDate);
        System.out.println("[ActionLog] Deleted " + deletedCount + " logs older than 2 days");
    }


}


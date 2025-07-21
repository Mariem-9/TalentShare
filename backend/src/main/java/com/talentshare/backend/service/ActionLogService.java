package com.talentshare.backend.service;

import com.talentshare.backend.model.ActionLog;
import com.talentshare.backend.model.User;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.ActionLogRepository;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.UserRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ActionLogService {
    @Autowired
    private ActionLogRepository actionLogRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private GroupeRepository groupeRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;

    private String getPublicIp() {
        try {
            URL url = new URL("https://api.ipify.org");
            BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()));
            return br.readLine();
        } catch (Exception e) {
            e.printStackTrace();
            return "unknown";
        }
    }


    public String resolveGroupIdsToNames(String context) {
        if (context == null) return "";

        Pattern groupPattern = Pattern.compile("group(?: ID)? (\\d+)", Pattern.CASE_INSENSITIVE);

        Matcher matcher = groupPattern.matcher(context);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            Long groupId = Long.parseLong(matcher.group(1));
            String groupName = groupeRepository.findById(groupId)
                .map(g -> g.getNom())
                .orElse("Unknown Group");

            matcher.appendReplacement(result, groupName);
        }
        matcher.appendTail(result);

        return result.toString();
    }
    public String resolveUserIdsToNames(String context) {
        if (context == null) return "";

        Pattern userPattern = Pattern.compile("user (\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = userPattern.matcher(context);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            Integer userId = Integer.parseInt(matcher.group(1));
            String username = userRepository.findById(userId)
                .map(u -> u.getUsername())
                .orElse("Unknown User");

            matcher.appendReplacement(result, username);
        }
        matcher.appendTail(result);

        return result.toString();
    }

    public void log(String action, String context, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) return;

        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        String ip = getPublicIp();
        String resolvedContext = resolveGroupIdsToNames(context);
        resolvedContext = resolveUserIdsToNames(resolvedContext);

        ActionLog log = new ActionLog();
        log.setUser(user);
        log.setAction(action);
        log.setContext(resolvedContext);
        log.setIpAddress(ip);
        log.setCreatedAt(LocalDateTime.now());

        actionLogRepository.save(log);
    }
    public List<ActionLog> getAllLogs() {
        List<ActionLog> logs = actionLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        logs.forEach(log -> {
            User user = log.getUser();
            if (user != null) {
                Utilisateur utilisateur = utilisateurRepository.findByUser(user).orElse(null);
                if (utilisateur != null && utilisateur.getAvatar() != null) {
                    String avatarUrl = "/api/files/" + utilisateur.getAvatar().getId();
                    user.setAvatarUrl(avatarUrl);  // set transient field here
                }
            }
        });

        return logs;
    }

    @Scheduled(cron = "0 0 2 * * *")  // Every day at 2 AM
    @Transactional
    public void deleteOldLogs() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(2);
        int deletedCount = actionLogRepository.deleteByCreatedAtBefore(cutoffDate);
        System.out.println("[ActionLog] Deleted " + deletedCount + " logs older than 2 days");
    }


}


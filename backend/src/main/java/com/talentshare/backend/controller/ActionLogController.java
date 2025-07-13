package com.talentshare.backend.controller;

import com.talentshare.backend.model.ActionLog;
import com.talentshare.backend.service.ActionLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/action-logs")
public class ActionLogController {
    @Autowired
    private ActionLogService actionLogService;

    @PostMapping
    public ResponseEntity<?> logFromFrontend(@RequestBody Map<String, String> payload,
                                             HttpServletRequest request) {
        String action = payload.get("action");
        String context = payload.get("context");
        actionLogService.log(action, context, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<ActionLog> getAllLogs() {
        return actionLogService.getAllLogs(); // Add this method in service if missing
    }
}


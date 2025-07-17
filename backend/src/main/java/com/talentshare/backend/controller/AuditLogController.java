package com.talentshare.backend.controller;

import com.talentshare.backend.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
    @Autowired
    private AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<?> logFromFrontend(@RequestBody Map<String, String> payload,
                                             HttpServletRequest request) {

        String action = payload.get("action");
        String details = payload.get("details");
        auditLogService.log(action, details, request);
        return ResponseEntity.ok().build();
    }

}


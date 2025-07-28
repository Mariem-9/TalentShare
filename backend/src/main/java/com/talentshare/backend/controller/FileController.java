package com.talentshare.backend.controller;


import com.talentshare.backend.model.FileEntity;
import com.talentshare.backend.service.FileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;


@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload/avatar/user")
    public ResponseEntity<FileEntity> uploadUserAvatar(@RequestParam("file") MultipartFile file,
                                                       @RequestParam("isPrivate") boolean isPrivate,
                                                       Principal principal,
                                                       HttpServletRequest request) throws IOException {
        return ResponseEntity.ok(fileService.uploadUserAvatar(file, isPrivate, principal, request));
    }


    @PostMapping("/upload/avatar/group/{groupId}")
    public ResponseEntity<FileEntity> uploadGroupAvatar(@RequestParam("file") MultipartFile file,
                                                        @PathVariable Long groupId,
                                                        Principal principal, HttpServletRequest request) throws IOException {
        return ResponseEntity.ok(fileService.uploadGroupAvatar(file, groupId, principal,request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getFile(@PathVariable Long id, Principal principal) throws IOException {
        FileService.FileWithResource fileWithResource = fileService.getFile(id, principal);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileWithResource.getFileEntity().getFileType()))
                .body(fileWithResource.getResource());
    }
    @GetMapping("/info/{id}")
    public ResponseEntity<FileEntity> getFileInfo(@PathVariable Long id) {
        return fileService.getFileEntity(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/upload/moment")
    public ResponseEntity<FileEntity> uploadMomentMedia(
        @RequestParam("file") MultipartFile file,
        Principal principal,
        HttpServletRequest request
    ) throws IOException {
        FileEntity saved = fileService.uploadMomentMedia(file, principal, request);
        return ResponseEntity.ok(saved);
    }


}


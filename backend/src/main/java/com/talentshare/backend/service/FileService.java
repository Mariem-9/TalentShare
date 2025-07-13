package com.talentshare.backend.service;

import com.talentshare.backend.model.FileEntity;
import com.talentshare.backend.model.Groupe;
import com.talentshare.backend.model.Utilisateur;
import com.talentshare.backend.repository.FileRepository;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.security.Principal;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final GroupeRepository groupeRepository;
    private final AuditLogService auditLogService;

    private final S3Client s3Client;
    private final String bucketName = "uploads";


    public FileEntity uploadUserAvatar(MultipartFile file,boolean isPrivate, Principal principal, HttpServletRequest request) throws IOException {
        Utilisateur utilisateur = utilisateurRepository.findByUser_Username(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));


        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));


        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setStoragePath(fileName);
        fileEntity.setFileType(file.getContentType());
        fileEntity.setSize(file.getSize());
        fileEntity.setPrivate(isPrivate);
        fileEntity.setUtilisateur(utilisateur);
        fileEntity = fileRepository.save(fileEntity);

        utilisateur.setAvatar(fileEntity);
        utilisateurRepository.save(utilisateur);


        auditLogService.log("UPLOAD_USER_AVATAR", "User uploaded new avatar: " + file.getOriginalFilename(), request);

        return fileEntity;
    }

    public FileEntity uploadGroupAvatar(MultipartFile file, Long groupId, Principal principal ,HttpServletRequest request) throws IOException {
        Groupe groupe = groupeRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Groupe introuvable"));

        if (!groupe.getCreateur().getUsername().equals(principal.getName())) {
            throw new RuntimeException("Non autorisé à modifier cet avatar");
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));


        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setStoragePath(fileName);
        fileEntity.setFileType(file.getContentType());
        fileEntity.setSize(file.getSize());
        fileEntity.setPrivate(false);
        fileEntity.setGroupeAvatar(groupe);

        groupe.setAvatar(fileEntity);

        fileRepository.save(fileEntity);

        auditLogService.log("UPLOAD_GROUP_AVATAR", "Avatar uploaded for group ID " + groupId, request);

        return fileEntity;
    }

    public class FileWithResource {
        private final FileEntity fileEntity;
        private final Resource resource;

        public FileWithResource(FileEntity fileEntity, Resource resource) {
            this.fileEntity = fileEntity;
            this.resource = resource;
        }
        public FileEntity getFileEntity() { return fileEntity; }
        public Resource getResource() { return resource; }
    }

public FileWithResource getFile(Long id, Principal principal) throws IOException {

    FileEntity file = fileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Fichier introuvable"));

    System.out.println("Principal: " + (principal != null ? principal.getName() : "null"));
    System.out.println("Fichier user: " + (file.getUtilisateur() != null ? file.getUtilisateur().getUser().getUsername() : "null"));

    if (file.isPrivate()) {
        if (principal == null) {
            throw new RuntimeException("Accès interdit (utilisateur non connecté)");
        }

        String currentUser = principal.getName();

        // Get Authentication to check roles
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        boolean isAdmin = authorities.stream()
                .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            if (file.getUtilisateur() != null) {
                if (!file.getUtilisateur().getUser().getUsername().equals(currentUser)) {
                    throw new RuntimeException("Accès interdit (utilisateur)");
                }
            } else if (file.getGroupeAvatar() != null) {
                if (!file.getGroupeAvatar().getCreateur().getUsername().equals(currentUser)) {
                    throw new RuntimeException("Accès interdit (groupe)");
                }
            } else {
                throw new RuntimeException("Fichier privé sans propriétaire connu");
            }
        }
    }
    // fichier public : accès libre

    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(file.getStoragePath())
            .build();

    ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);

    Resource resource = new InputStreamResource(s3Object);

    return new FileWithResource(file, resource);
}

    public Optional<FileEntity> getFileEntity(Long id) {
        return fileRepository.findById(id);
    }
}

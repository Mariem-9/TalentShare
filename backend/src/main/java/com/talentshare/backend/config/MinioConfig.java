package com.talentshare.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import org.springframework.beans.factory.annotation.Value;

import java.net.URI;

@Configuration
public class MinioConfig {

    @Value("${minio.endpoint}")
    private String minioEndpoint;


    @Bean
    public S3Client s3Client() {
        System.out.println("MinIO Endpoint: " + minioEndpoint); // pour debug
        return S3Client.builder()
//                .endpointOverride(URI.create("http://localhost:9000")) // MinIO URL
                .endpointOverride(URI.create(minioEndpoint))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create("minioadmin", "minioadmin")))
                .region(Region.US_EAST_1) // dummy region, MinIO ignores this
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)  // important for MinIO compatibility
                        .build())
                .build();
    }
}


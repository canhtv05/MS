package com.leaf.file.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.file.config.ApplicationProperties;
import io.minio.GetObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
public class MinioStorageService {

    private static final int DEFAULT_PRESIGNED_EXPIRY_SECONDS = 7 * 24 * 3600;

    private final MinioClient minioClient;
    private final ApplicationProperties applicationProperties;

    public void putObject(String objectKey, MultipartFile file) {
        try {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(applicationProperties.getBucket())
                    .object(objectKey)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );
        } catch (Exception e) {
            log.error("Minio upload failed: {}", e.getMessage());
            throw new ApiException(ErrorMessage.FILE_UPLOAD_FAILED);
        }
    }

    public String getPresignedUrl(String objectKey) {
        return getPresignedUrl(objectKey, DEFAULT_PRESIGNED_EXPIRY_SECONDS);
    }

    public String getPresignedUrl(String objectKey, int expirySeconds) {
        try {
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(applicationProperties.getBucket())
                    .object(objectKey)
                    .expiry(expirySeconds)
                    .build()
            );
        } catch (Exception e) {
            log.warn("Presigned URL failed, fallback direct URL: {}", e.getMessage());
            return applicationProperties.getUrl() + "/" + applicationProperties.getBucket() + "/" + objectKey;
        }
    }

    public void removeObject(String objectKey) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder().bucket(applicationProperties.getBucket()).object(objectKey).build()
            );
        } catch (Exception e) {
            log.warn("Minio delete failed: {}", objectKey);
            throw new ApiException(ErrorMessage.FILE_NOT_FOUND);
        }
    }

    public InputStream getObjectStream(String objectKey) {
        try {
            return minioClient.getObject(
                GetObjectArgs.builder().bucket(applicationProperties.getBucket()).object(objectKey).build()
            );
        } catch (Exception e) {
            log.warn("Minio get object failed: {}", objectKey);
            throw new ApiException(ErrorMessage.FILE_NOT_FOUND);
        }
    }
}

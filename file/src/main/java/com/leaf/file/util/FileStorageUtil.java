package com.leaf.file.util;

import com.leaf.common.grpc.ResourceTypeGrpc;
import com.leaf.framework.blocking.util.CommonUtils;
import java.util.UUID;
import lombok.experimental.UtilityClass;

@UtilityClass
public class FileStorageUtil {

    public static String sanitizeFileName(String name) {
        if (name == null || name.isBlank()) return "file";
        String safe = name.replaceAll("[\\\\/:*?\"<>|\\s]+", "_").trim();
        return safe.isEmpty() ? "file" : safe;
    }

    public static String extractObjectKeyFromUrl(String urlOrKey) {
        if (CommonUtils.isEmpty(urlOrKey)) return null;
        if (!urlOrKey.startsWith("http")) return urlOrKey;
        try {
            String path = urlOrKey.replaceFirst("^https?://[^/]+/", "");
            int bucketEnd = path.indexOf("/");
            if (bucketEnd >= 0 && bucketEnd < path.length() - 1) return path.substring(bucketEnd + 1);
            return path;
        } catch (Exception e) {
            return urlOrKey;
        }
    }

    public String generateObjectKey(ResourceTypeGrpc resourceType, String userId, String originalFilename) {
        String prefix = resourceType.name().toLowerCase();
        String safeName = FileStorageUtil.sanitizeFileName(originalFilename);
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        return prefix + "/" + userId + "/" + uniqueId + "_" + safeName;
    }
}

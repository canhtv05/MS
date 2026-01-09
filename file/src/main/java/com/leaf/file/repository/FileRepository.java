package com.leaf.file.repository;

import com.leaf.common.grpc.ResourceType;
import com.leaf.file.domain.File;
import com.leaf.file.dto.FileResponse;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends MongoRepository<File, String> {
    Page<File> findAllByOwnerId(String ownerId, Pageable pageable);

    Optional<FileResponse> getFileById(String id);

    List<File> findAllByIdIn(List<String> ids);

    @Query("{ 'ownerId': ?0, 'resourceType': { $in: ?1 } }")
    List<FileResponse> getFilesByTypes(String userId, List<ResourceType> resourceTypes);

    boolean existsByOwnerId(String ownerId);
}

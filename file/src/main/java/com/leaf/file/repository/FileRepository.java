package com.leaf.file.repository;

import com.leaf.common.grpc.ResourceType;
import com.leaf.file.domain.File;
import com.leaf.file.domain.Image;
import com.leaf.file.dto.FileResponse;
import java.util.List;
import java.util.Optional;
import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends MongoRepository<File, String> {
    Page<File> findAllByOwnerId(String ownerId, Pageable pageable);

    Optional<FileResponse> getFileById(String id);

    List<File> findAllByIdIn(List<String> ids);

    @Query("{ 'ownerId': ?0, 'images.resourceType': { $in: ?1 } }")
    List<FileResponse> getFilesByTypes(String userId, List<ResourceType> resourceTypes);

    @Aggregation(
        pipeline = {
            "{ '$match': { 'ownerId': ?0 } }",
            "{ '$unwind': '$images' }",
            "{ '$match': { 'images.resourceType': { '$in': ?1 } } }",
            "{ '$sort': { 'createdAt': -1 } }",
            "{ '$replaceRoot': { 'newRoot': '$images' } }"
        }
    )
    List<Image> findImagesByOwnerIdAndResourceType(String ownerId, List<ResourceType> resourceTypes, Pageable pageable);

    @Aggregation(
        pipeline = {
            "{ '$match': { 'ownerId': ?0 } }",
            "{ '$unwind': '$images' }",
            "{ '$match': { 'images.resourceType': { '$in': ?1 } } }",
            "{ '$count': 'total' }"
        }
    )
    List<Document> countImagesByOwnerIdAndResourceType(String ownerId, List<ResourceType> resourceTypes);

    boolean existsByOwnerId(String ownerId);
}

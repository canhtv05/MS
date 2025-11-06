package com.canhtv05.file.repository;

import com.canhtv05.file.domain.File;
import com.canhtv05.file.dto.FileResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends MongoRepository<File, String> {

    Page<File> findAllByOwnerId(String ownerId, Pageable pageable);

    Optional<FileResponse> getFileById(String id);

    List<File> findAllByIdIn(List<String> ids);
}

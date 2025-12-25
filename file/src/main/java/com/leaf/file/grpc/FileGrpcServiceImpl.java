package com.leaf.file.grpc;

import com.google.protobuf.ByteString;
import com.leaf.common.exception.ApiException;
import com.leaf.common.grpc.*;
import com.leaf.file.mapper.FileProtoMapper;
import com.leaf.file.service.FileService;
import io.grpc.stub.StreamObserver;
import java.util.List;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@GrpcService
@RequiredArgsConstructor
public class FileGrpcServiceImpl extends FileGrpcServiceGrpc.FileGrpcServiceImplBase {

    private final FileService fileService;

    @Override
    public void deleteById(DeleteByIdRequest request, StreamObserver<DeleteByIdResponse> responseObserver) {
        try {
            fileService.deleteById(request.getFileId());

            DeleteByIdResponse response = DeleteByIdResponse.newBuilder().setSuccess(true).build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }
            responseObserver.onError(e);
        }
    }

    @Override
    public void getFileByIds(GetFilesByIdsRequest request, StreamObserver<GetFilesByIdsResponse> responseObserver) {
        try {
            List<com.leaf.file.dto.FileResponse> files = fileService.getFilesByIds(request.getIdsList());

            GetFilesByIdsResponse.Builder builder = GetFilesByIdsResponse.newBuilder();
            files.forEach(f -> builder.addFiles(FileProtoMapper.toProto(f)));

            responseObserver.onNext(builder.build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }
            responseObserver.onError(e);
        }
    }

    @Override
    public void uploadFiles(
        UploadFilesRequest request,
        StreamObserver<com.leaf.common.grpc.FileResponse> responseObserver
    ) {
        try {
            List<ByteString> bytesList = request.getFilesList();
            MultipartFile[] files = convertFromGrpc(bytesList);
            com.leaf.file.dto.FileResponse dto = fileService.upload(files, request.getResourceType());
            com.leaf.common.grpc.FileResponse protoResponse = FileProtoMapper.toProto(dto);

            responseObserver.onNext(protoResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }
            responseObserver.onError(e);
        }
    }

    @Override
    public void uploadImage(
        UploadOneImageRequest request,
        StreamObserver<com.leaf.common.grpc.ImageResponse> responseObserver
    ) {
        try {
            MultipartFile file = convertFromGrpc(request.getFile());
            String userId = request.getUserId();
            com.leaf.file.dto.ImageResponse dto = fileService.processImageUpload(
                file,
                request.getResourceType(),
                userId
            );
            com.leaf.common.grpc.ImageResponse protoResponse = FileProtoMapper.mapImage(dto);

            responseObserver.onNext(protoResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }
            responseObserver.onError(e);
        }
    }

    @Override
    public void uploadVideo(
        UploadOneVideoRequest request,
        StreamObserver<com.leaf.common.grpc.VideoResponse> responseObserver
    ) {
        try {
            MultipartFile file = convertFromGrpc(request.getFile());
            String userId = request.getUserId();
            com.leaf.file.dto.VideoResponse dto = fileService.processVideoUpload(
                file,
                request.getResourceType(),
                userId
            );
            com.leaf.common.grpc.VideoResponse protoResponse = FileProtoMapper.mapVideo(dto);

            responseObserver.onNext(protoResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }
            responseObserver.onError(e);
        }
    }

    private MultipartFile convertFromGrpc(ByteString file) {
        return toMultipartFile(file);
    }

    private MultipartFile[] convertFromGrpc(List<ByteString> filesList) {
        return filesList.stream().map(FileGrpcServiceImpl::toMultipartFile).toArray(MultipartFile[]::new);
    }

    private static MultipartFile toMultipartFile(ByteString bs) {
        try {
            return new MockMultipartFile("file", "file", "application/octet-stream", bs.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert gRPC bytes to MultipartFile", e);
        }
    }
}

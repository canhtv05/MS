package com.leaf.file.grpc;

import com.google.protobuf.ByteString;
import com.leaf.common.grpc.*;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.ImageResponse;
import com.leaf.file.dto.VideoResponse;
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
    public void deleteById(DeleteByIdGrpcRequest request, StreamObserver<DeleteByIdGrpcResponse> responseObserver) {
        fileService.deleteById(request.getFileId());

        DeleteByIdGrpcResponse response = DeleteByIdGrpcResponse.newBuilder().setSuccess(true).build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getFileByIds(
        GetFilesByIdsGrpcRequest request,
        StreamObserver<GetFilesByIdsGrpcResponse> responseObserver
    ) {
        List<FileResponse> files = fileService.getFilesByIds(request.getIdsList());

        GetFilesByIdsGrpcResponse.Builder builder = GetFilesByIdsGrpcResponse.newBuilder();
        files.forEach(f -> builder.addFiles(FileProtoMapper.toProto(f)));

        responseObserver.onNext(builder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void uploadFiles(UploadFilesGrpcRequest request, StreamObserver<FileGrpcResponse> responseObserver) {
        try {
            List<ByteString> bytesList = request.getFilesList();
            MultipartFile[] files = convertFromGrpc(bytesList);
            FileResponse dto = fileService.uploadFiles(files, request.getResourceType());
            FileGrpcResponse protoResponse = FileProtoMapper.toProto(dto);

            responseObserver.onNext(protoResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void uploadImage(UploadOneImageGrpcRequest request, StreamObserver<ImageGrpcResponse> responseObserver) {
        try {
            MultipartFile file = convertFromGrpc(request.getFile());
            String userId = request.getUserId();
            ImageResponse dto = fileService.uploadOneImage(file, request.getResourceType(), userId, false);
            ImageGrpcResponse protoResponse = FileProtoMapper.mapImage(dto);

            responseObserver.onNext(protoResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void uploadVideo(UploadOneVideoGrpcRequest request, StreamObserver<VideoGrpcResponse> responseObserver) {
        try {
            MultipartFile file = convertFromGrpc(request.getFile());
            String userId = request.getUserId();
            VideoResponse dto = fileService.uploadOneVideo(file, request.getResourceType(), userId, false);
            VideoGrpcResponse protoResponse = FileProtoMapper.mapVideo(dto);

            responseObserver.onNext(protoResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            throw new RuntimeException(e);
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

    @Override
    public void getFileImages(
        GetFileImagesGrpcRequest request,
        StreamObserver<GetFileImagesGrpcResponse> responseObserver
    ) {
        SearchGrpcRequest searchRequest = SearchGrpcRequest.newBuilder()
            .setSearchText(request.getSearchRequest().getSearchText())
            .setPage(request.getSearchRequest().getPage())
            .setSize(request.getSearchRequest().getSize())
            .setSortOrder(request.getSearchRequest().getSortOrder())
            .setSortField(request.getSearchRequest().getSortField())
            .build();

        var result = fileService.getFileImageByUserIdAndResourceType(
            request.getUserId(),
            request.getResourceTypesList(),
            searchRequest
        );

        GetFileImagesGrpcResponse response = GetFileImagesGrpcResponse.newBuilder()
            .addAllData(result.data().stream().map(FileProtoMapper::mapImage).toList())
            .setPagination(FileProtoMapper.toProto(result.pagination()))
            .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

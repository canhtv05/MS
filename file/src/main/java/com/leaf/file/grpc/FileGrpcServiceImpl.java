package com.leaf.file.grpc;

import java.util.List;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.google.protobuf.ByteString;
import com.leaf.common.grpc.*;
import com.leaf.file.mapper.FileProtoMapper;
import com.leaf.file.service.FileService;

import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class FileGrpcServiceImpl extends FileGrpcServiceGrpc.FileGrpcServiceImplBase {

    private final FileService fileService;

    @Override
    public void deleteById(DeleteByIdRequest request, StreamObserver<DeleteByIdResponse> responseObserver) {
        try {
            fileService.deleteById(request.getFileId());

            DeleteByIdResponse response = DeleteByIdResponse.newBuilder()
                    .setSuccess(true)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
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
            responseObserver.onError(e);
        }
    }

    @Override
    public void uploadFiles(UploadFilesRequest request, StreamObserver<FileResponse> responseObserver) {
        try {
            // ✅ lấy đúng list bytes
            List<ByteString> bytesList = request.getFilesList();

            // ✅ convert to MultipartFile[]
            MultipartFile[] files = convertFromGrpc(bytesList);

            // ✅ xử lý upload
            com.leaf.file.dto.FileResponse dto = fileService.upload(files);

            // ✅ convert sang proto response
            FileResponse protoResponse = FileProtoMapper.toProto(dto);

            responseObserver.onNext(protoResponse);
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    private MultipartFile[] convertFromGrpc(List<ByteString> filesList) {
        return filesList.stream()
                .map(FileGrpcServiceImpl::toMultipartFile)
                .toArray(MultipartFile[]::new);
    }

    private static MultipartFile toMultipartFile(ByteString bs) {
        try {
            return new MockMultipartFile(
                    "file",
                    "file",
                    "application/octet-stream",
                    bs.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert gRPC bytes to MultipartFile", e);
        }
    }
}

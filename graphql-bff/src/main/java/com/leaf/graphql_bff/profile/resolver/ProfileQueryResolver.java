package com.leaf.graphql_bff.profile.resolver;

import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.common.grpc.GetFileImagesGrpcRequest;
import com.leaf.common.grpc.ResourceTypeGrpc;
import com.leaf.common.grpc.SearchGrpcRequest;
import com.leaf.common.grpc.UserProfileIdGrpcRequest;
import com.leaf.graphql_bff.profile.client.ProfileGrpcFileClient;
import com.leaf.graphql_bff.profile.client.ProfileGrpcProfileClient;
import com.leaf.graphql_bff.profile.dto.DetailUserProfileDTO;
import com.leaf.graphql_bff.profile.dto.ImageDTO;
import com.leaf.graphql_bff.profile.dto.UserProfileIntroduceDTO;
import com.leaf.graphql_bff.profile.dto.UserProfilePrivacyDTO;
import com.leaf.graphql_bff.profile.mapper.UserProfileMapper;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import java.util.List;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@DgsComponent
@RequiredArgsConstructor
public class ProfileQueryResolver {

    private final ProfileGrpcProfileClient grpcProfileClient;
    private final ProfileGrpcFileClient grpcFileClient;

    @DgsQuery(field = "userDetail")
    public Mono<DetailUserProfileDTO> userDetail(String username) {
        return Mono.fromCallable(() ->
            grpcProfileClient.getUserProfile(UserProfileIdGrpcRequest.newBuilder().setUserId(username).build())
        )
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap(userProfileResponse ->
                Mono.justOrEmpty(UserProfileMapper.getInstance().toDetailUserProfileDTO(userProfileResponse))
            );
    }

    @DgsData(parentType = "DetailUserProfileDTO", field = "introduce")
    public Mono<UserProfileIntroduceDTO> introduce(DgsDataFetchingEnvironment dfe) {
        DetailUserProfileDTO parent = dfe.getSource();
        return Mono.fromCallable(() ->
            grpcProfileClient.getUserProfileIntroduce(
                UserProfileIdGrpcRequest.newBuilder().setUserId(parent.getUserId()).build()
            )
        )
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap(introduce ->
                Mono.justOrEmpty(UserProfileMapper.getInstance().toUserProfileIntroduceDTO(introduce))
            );
    }

    @DgsData(parentType = "DetailUserProfileDTO", field = "privacy")
    public Mono<UserProfilePrivacyDTO> privacy(DgsDataFetchingEnvironment dfe) {
        DetailUserProfileDTO parent = dfe.getSource();
        return Mono.fromCallable(() ->
            grpcProfileClient.getUserProfilePrivacy(
                UserProfileIdGrpcRequest.newBuilder().setUserId(parent.getUserId()).build()
            )
        )
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap(privacy -> Mono.justOrEmpty(UserProfileMapper.getInstance().toUserProfilePrivacyDTO(privacy)));
    }

    @DgsData(parentType = "DetailUserProfileDTO", field = "images")
    public Mono<SearchResponse<ImageDTO>> images(
        DgsDataFetchingEnvironment dfe,
        @InputArgument Integer page,
        @InputArgument Integer size
    ) {
        DetailUserProfileDTO parent = dfe.getSource();

        int safePage = (page == null || page < 1) ? 1 : page;
        int safeSize = (size == null || size < 1) ? 20 : size;

        return Mono.fromCallable(() ->
            grpcFileClient.getFileImagesResponse(
                GetFileImagesGrpcRequest.newBuilder()
                    .setSearchRequest(SearchGrpcRequest.newBuilder().setPage(safePage - 1).setSize(safeSize).build())
                    .addAllResourceTypes(
                        List.of(ResourceTypeGrpc.RESOURCE_TYPE_AVATAR, ResourceTypeGrpc.RESOURCE_TYPE_COVER)
                    )
                    .setUserId(parent.getUserId())
                    .build()
            )
        )
            .subscribeOn(Schedulers.boundedElastic())
            .map(response -> {
                var protoPage = response.getPagination();
                PageResponse pageResponse = PageResponse.builder()
                    .currentPage(protoPage.getCurrentPage())
                    .totalPages(protoPage.getTotalPages())
                    .size(protoPage.getSize())
                    .count(protoPage.getCount())
                    .total(protoPage.getTotal())
                    .build();

                List<ImageDTO> data = response
                    .getDataList()
                    .stream()
                    .map(img -> UserProfileMapper.getInstance().toImageDTO(img))
                    .toList();

                return new SearchResponse<>(data, pageResponse);
            });
    }
}

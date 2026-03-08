package com.leaf.graphql_bff.profile.mapper;

import com.leaf.common.grpc.ImageGrpcResponse;
import com.leaf.common.grpc.InterestGrpcDTO;
import com.leaf.common.grpc.UserProfileGrpcResponse;
import com.leaf.common.grpc.UserProfileIntroduceGrpcDTO;
import com.leaf.common.grpc.UserProfilePrivacyGrpcDTO;
import com.leaf.common.grpc.VideoGrpcResponse;
import com.leaf.framework.blocking.util.ConvertProto;
import com.leaf.graphql_bff.profile.dto.DetailUserProfileDTO;
import com.leaf.graphql_bff.profile.dto.ImageDTO;
import com.leaf.graphql_bff.profile.dto.InterestDTO;
import com.leaf.graphql_bff.profile.dto.UserProfileIntroduceDTO;
import com.leaf.graphql_bff.profile.dto.UserProfilePrivacyDTO;
import com.leaf.graphql_bff.profile.dto.VideoDTO;
import java.util.List;

public class UserProfileMapper {

    private static final UserProfileMapper INSTANCE = new UserProfileMapper();

    private UserProfileMapper() {}

    public static UserProfileMapper getInstance() {
        return INSTANCE;
    }

    private InterestDTO tInterestDTO(InterestGrpcDTO interestDTO) {
        if (interestDTO == null) {
            return null;
        }
        return InterestDTO.builder()
            .id(ConvertProto.nullToEmpty(interestDTO.getId()))
            .title(ConvertProto.nullToEmpty(interestDTO.getTitle()))
            .color(ConvertProto.nullToEmpty(interestDTO.getColor()))
            .code(ConvertProto.nullToEmpty(interestDTO.getCode()))
            .createdBy(ConvertProto.nullToEmpty(interestDTO.getCreatedBy()))
            .createdDate(ConvertProto.convertTimestampToInstant(interestDTO.getCreatedDate()))
            .modifiedBy(ConvertProto.nullToEmpty(interestDTO.getModifiedBy()))
            .modifiedDate(ConvertProto.convertTimestampToInstant(interestDTO.getModifiedDate()))
            .build();
    }

    private List<InterestDTO> toListInterestDTO(List<InterestGrpcDTO> interestDTOList) {
        if (interestDTOList == null) {
            return null;
        }
        return interestDTOList.stream().map(this::tInterestDTO).toList();
    }

    public UserProfileIntroduceDTO toUserProfileIntroduceDTO(UserProfileIntroduceGrpcDTO userProfileIntroduceDTO) {
        if (userProfileIntroduceDTO == null) {
            return null;
        }
        return UserProfileIntroduceDTO.builder()
            .id(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getId()))
            .city(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getCity()))
            .hometown(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getHometown()))
            .jobTitle(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getJobTitle()))
            .company(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getCompany()))
            .school(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getSchool()))
            .websiteUrl(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getWebsiteUrl()))
            .githubUrl(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getGithubUrl()))
            .linkedinUrl(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getLinkedinUrl()))
            .xUrl(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getXUrl()))
            .instagramUrl(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getInstagramUrl()))
            .tiktokUrl(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getTiktokUrl()))
            .facebookUrl(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getFacebookUrl()))
            .dob(ConvertProto.convertTimestampToLocalDate(userProfileIntroduceDTO.getDob()))
            .gender(userProfileIntroduceDTO.getGender())
            .relationshipStatus(userProfileIntroduceDTO.getRelationshipStatus())
            .phoneNumber(ConvertProto.nullToEmpty(userProfileIntroduceDTO.getPhoneNumber()))
            .interests(toListInterestDTO(userProfileIntroduceDTO.getInterestsList()))
            .build();
    }

    public UserProfilePrivacyDTO toUserProfilePrivacyDTO(UserProfilePrivacyGrpcDTO userProfilePrivacyDTO) {
        if (userProfilePrivacyDTO == null) {
            return null;
        }
        return UserProfilePrivacyDTO.builder()
            .id(ConvertProto.nullToEmpty(userProfilePrivacyDTO.getId()))
            .userId(ConvertProto.nullToEmpty(userProfilePrivacyDTO.getUserId()))
            .profileVisibility(userProfilePrivacyDTO.getProfileVisibility())
            .friendsVisibility(userProfilePrivacyDTO.getFriendsVisibility())
            .postsVisibility(userProfilePrivacyDTO.getPostsVisibility())
            .introduceVisibility(userProfilePrivacyDTO.getIntroduceVisibility())
            .galleryVisibility(userProfilePrivacyDTO.getGalleryVisibility())
            .build();
    }

    public DetailUserProfileDTO toDetailUserProfileDTO(UserProfileGrpcResponse userProfileResponse) {
        if (userProfileResponse == null) {
            return null;
        }

        return DetailUserProfileDTO.builder()
            .id(ConvertProto.nullToEmpty(userProfileResponse.getId()))
            .userId(ConvertProto.nullToEmpty(userProfileResponse.getUserId()))
            .bio(userProfileResponse.getBio())
            .fullname(userProfileResponse.getFullname())
            .coverUrl(ConvertProto.nullToEmpty(userProfileResponse.getCoverUrl()))
            .avatarUrl(ConvertProto.nullToEmpty(userProfileResponse.getAvatarUrl()))
            .lastOnlineAt(ConvertProto.convertTimestampToOffsetDateTime(userProfileResponse.getLastOnlineAt()))
            .followersCount(userProfileResponse.getFollowersCount())
            .followingCount(userProfileResponse.getFollowingCount())
            .createdDate(ConvertProto.convertTimestampToOffsetDateTime(userProfileResponse.getCreatedDate()))
            .build();
    }

    public ImageDTO toImageDTO(ImageGrpcResponse imageResponse) {
        if (imageResponse == null) {
            return null;
        }
        return ImageDTO.builder()
            .imageUrl(imageResponse.getImageUrl())
            .contentType(imageResponse.getContentType())
            .fileSize(imageResponse.getFileSize())
            .originFileName(imageResponse.getOriginFileName())
            .createdAt(ConvertProto.convertTimestampToOffsetDateTime(imageResponse.getCreatedAt()))
            .resourceType(imageResponse.getResourceType())
            .build();
    }

    public VideoDTO toVideoDTO(VideoGrpcResponse videoResponse) {
        if (videoResponse == null) {
            return null;
        }
        return VideoDTO.builder()
            .videoUrl(videoResponse.getVideoUrl())
            .playtimeSeconds(videoResponse.getPlaytimeSeconds())
            .playtimeString(videoResponse.getPlaytimeString())
            .thumbnailUrl(videoResponse.getThumbnailUrl())
            .previewVttUrl(videoResponse.getPreviewVttUrl())
            .contentType(videoResponse.getContentType())
            .fileSize(videoResponse.getFileSize())
            .originFileName(videoResponse.getOriginFileName())
            .createdAt(ConvertProto.convertTimestampToOffsetDateTime(videoResponse.getCreatedAt()))
            .resourceType(videoResponse.getResourceType())
            .build();
    }
}

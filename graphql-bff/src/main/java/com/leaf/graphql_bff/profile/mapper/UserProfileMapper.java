package com.leaf.graphql_bff.profile.mapper;

import com.leaf.common.utils.ConvertProto;
import com.leaf.graphql_bff.profile.dto.DetailUserProfileDTO;
import com.leaf.graphql_bff.profile.dto.InterestDTO;
import com.leaf.graphql_bff.profile.dto.UserProfileIntroduceDTO;
import com.leaf.graphql_bff.profile.dto.UserProfilePrivacyDTO;
import java.util.List;

public class UserProfileMapper {

    private static UserProfileMapper instance;

    public static UserProfileMapper getInstance() {
        if (instance == null) {
            instance = new UserProfileMapper();
        }
        return instance;
    }

    private InterestDTO tInterestDTO(com.leaf.common.grpc.InterestDTO interestDTO) {
        if (interestDTO == null) {
            return null;
        }
        return InterestDTO.builder()
            .id(ConvertProto.nullToEmpty(interestDTO.getId()))
            .title(ConvertProto.nullToEmpty(interestDTO.getTitle()))
            .color(ConvertProto.nullToEmpty(interestDTO.getColor()))
            .build();
    }

    private List<InterestDTO> toListInterestDTO(List<com.leaf.common.grpc.InterestDTO> interestDTOList) {
        if (interestDTOList == null) {
            return null;
        }
        return interestDTOList.stream().map(this::tInterestDTO).toList();
    }

    public UserProfileIntroduceDTO toUserProfileIntroduceDTO(
        com.leaf.common.grpc.UserProfileIntroduceDTO userProfileIntroduceDTO
    ) {
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

    public UserProfilePrivacyDTO toUserProfilePrivacyDTO(
        com.leaf.common.grpc.UserProfilePrivacyDTO userProfilePrivacyDTO
    ) {
        if (userProfilePrivacyDTO == null) {
            return null;
        }
        return UserProfilePrivacyDTO.builder()
            .id(ConvertProto.nullToEmpty(userProfilePrivacyDTO.getId()))
            .userId(ConvertProto.nullToEmpty(userProfilePrivacyDTO.getUserId()))
            .profileVisibility(userProfilePrivacyDTO.getProfileVisibility())
            .friendsVisibility(userProfilePrivacyDTO.getFriendsVisibility())
            .postsVisibility(userProfilePrivacyDTO.getPostsVisibility())
            .build();
    }

    public DetailUserProfileDTO toDetailUserProfileDTO(com.leaf.common.grpc.UserProfileResponse userProfileResponse) {
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

    public com.leaf.graphql_bff.profile.dto.ImageDTO toImageDTO(com.leaf.common.grpc.ImageResponse imageResponse) {
        if (imageResponse == null) {
            return null;
        }
        return com.leaf.graphql_bff.profile.dto.ImageDTO.builder()
            .imageUrl(imageResponse.getImageUrl())
            .contentType(imageResponse.getContentType())
            .fileSize(imageResponse.getFileSize())
            .originFileName(imageResponse.getOriginFileName())
            .publicId(imageResponse.getPublicId())
            .createdAt(ConvertProto.convertTimestampToOffsetDateTime(imageResponse.getCreatedAt()))
            .resourceType(imageResponse.getResourceType())
            .build();
    }

    public com.leaf.graphql_bff.profile.dto.VideoDTO toVideoDTO(com.leaf.common.grpc.VideoResponse videoResponse) {
        if (videoResponse == null) {
            return null;
        }
        return com.leaf.graphql_bff.profile.dto.VideoDTO.builder()
            .videoUrl(videoResponse.getVideoUrl())
            .playtimeSeconds(videoResponse.getPlaytimeSeconds())
            .playtimeString(videoResponse.getPlaytimeString())
            .thumbnailUrl(videoResponse.getThumbnailUrl())
            .previewVttUrl(videoResponse.getPreviewVttUrl())
            .contentType(videoResponse.getContentType())
            .fileSize(videoResponse.getFileSize())
            .originFileName(videoResponse.getOriginFileName())
            .publicId(videoResponse.getPublicId())
            .createdAt(ConvertProto.convertTimestampToOffsetDateTime(videoResponse.getCreatedAt()))
            .resourceType(videoResponse.getResourceType())
            .build();
    }
}

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

    private UserProfileIntroduceDTO toUserProfileIntroduceDTO(
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

    private UserProfilePrivacyDTO toUserProfilePrivacyDTO(
        com.leaf.common.grpc.UserProfilePrivacyDTO userProfilePrivacyDTO
    ) {
        if (userProfilePrivacyDTO == null) {
            return null;
        }
        return UserProfilePrivacyDTO.builder()
            .id(ConvertProto.nullToEmpty(userProfilePrivacyDTO.getId()))
            .profileVisibility(userProfilePrivacyDTO.getProfileVisibility())
            .friendsVisibility(userProfilePrivacyDTO.getFriendsVisibility())
            .postsVisibility(userProfilePrivacyDTO.getPostsVisibility())
            .build();
    }

    public DetailUserProfileDTO toDetailUserProfileDTO(
        com.leaf.common.grpc.UserProfileResponse userProfileResponse,
        com.leaf.common.grpc.UserProfileIntroduceDTO userProfileIntroduceDTO,
        com.leaf.common.grpc.UserProfilePrivacyDTO userProfilePrivacyDTO
    ) {
        if (userProfileResponse == null || userProfileIntroduceDTO == null || userProfilePrivacyDTO == null) {
            return null;
        }

        return DetailUserProfileDTO.builder()
            .id(ConvertProto.nullToEmpty(userProfileResponse.getId()))
            .userId(ConvertProto.nullToEmpty(userProfileResponse.getUserId()))
            .introduce(toUserProfileIntroduceDTO(userProfileIntroduceDTO))
            .privacy(toUserProfilePrivacyDTO(userProfilePrivacyDTO))
            .coverUrl(ConvertProto.nullToEmpty(userProfileResponse.getCoverUrl()))
            .avatarUrl(ConvertProto.nullToEmpty(userProfileResponse.getAvatarUrl()))
            .lastOnlineAt(ConvertProto.convertTimestampToInstant(userProfileResponse.getLastOnlineAt()))
            .followersCount(userProfileResponse.getFollowersCount())
            .followingCount(userProfileResponse.getFollowingCount())
            .createdDate(ConvertProto.convertTimestampToInstant(userProfileResponse.getCreatedDate()))
            .build();
    }
}

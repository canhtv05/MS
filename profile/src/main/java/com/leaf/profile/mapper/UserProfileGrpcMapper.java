package com.leaf.profile.mapper;

import com.google.protobuf.Timestamp;
import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.PrivacyLevel;
import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.utils.ConvertProto;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import java.time.Instant;
import java.time.LocalDate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserProfileGrpcMapper {
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "fullname", source = "fullname")
    UserProfileCreationReq toUserProfileCreationReq(UserProfileDTO grpcRequest);

    default com.leaf.common.grpc.UserProfileResponse toGrpcUserProfileResponse(UserProfileResponse response) {
        if (response == null) {
            return null;
        }

        com.leaf.common.grpc.UserProfileResponse.Builder builder = com.leaf.common.grpc.UserProfileResponse.newBuilder()
            .setId(nullToEmpty(response.getId()))
            .setUserId(nullToEmpty(response.getUserId()))
            .setFullname(nullToEmpty(response.getFullname()))
            .setCity(nullToEmpty(response.getCity()))
            .setBio(nullToEmpty(response.getBio()))
            .setCoverUrl(nullToEmpty(response.getCoverUrl()))
            .setAvatarUrl(nullToEmpty(response.getAvatarUrl()))
            .setPhoneNumber(nullToEmpty(response.getPhoneNumber()))
            .setTiktokUrl(nullToEmpty(response.getTiktokUrl()))
            .setXUrl(nullToEmpty(response.getXUrl()))
            .setInstagramUrl(nullToEmpty(response.getInstagramUrl()))
            .setFacebookUrl(nullToEmpty(response.getFacebookUrl()))
            .setGender(response.getGender() != null ? response.getGender() : Gender.GENDER_UNSPECIFIED)
            .setProfileVisibility(
                response.getProfileVisibility() != null
                    ? response.getProfileVisibility()
                    : PrivacyLevel.PRIVACY_LEVEL_UNSPECIFIED
            )
            .setFriendsVisibility(
                response.getFriendsVisibility() != null
                    ? response.getFriendsVisibility()
                    : PrivacyLevel.PRIVACY_LEVEL_UNSPECIFIED
            )
            .setPostsVisibility(
                response.getPostsVisibility() != null
                    ? response.getPostsVisibility()
                    : PrivacyLevel.PRIVACY_LEVEL_UNSPECIFIED
            )
            .setFollowersCount(response.getFollowersCount() != null ? response.getFollowersCount() : 0L)
            .setFollowingCount(response.getFollowingCount() != null ? response.getFollowingCount() : 0L);

        if (response.getDob() != null) {
            builder.setDob(toTimestamp(response.getDob()));
        }
        if (response.getLastOnlineAt() != null) {
            builder.setLastOnlineAt(toTimestamp(response.getLastOnlineAt()));
        }
        if (response.getCreatedDate() != null) {
            builder.setCreatedDate(toTimestamp(response.getCreatedDate()));
        }

        return builder.build();
    }

    default UserProfileDTO toGrpcUserProfileDTO(UserProfileResponse response) {
        if (response == null) {
            return null;
        }
        return UserProfileDTO.newBuilder().setUserId(nullToEmpty(response.getUserId())).build();
    }

    @Named("toTimestamp")
    default Timestamp toTimestamp(LocalDate localDate) {
        return ConvertProto.convertLocalDateToTimestamp(localDate);
    }

    @Named("toTimestamp")
    default Timestamp toTimestamp(Instant instant) {
        return ConvertProto.convertInstantToTimestamp(instant);
    }

    default String nullToEmpty(String value) {
        return value != null ? value : "";
    }
}

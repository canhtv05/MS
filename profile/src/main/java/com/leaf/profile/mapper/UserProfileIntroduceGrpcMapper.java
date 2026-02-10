package com.leaf.profile.mapper;

import com.google.protobuf.Timestamp;
import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.RelationshipStatus;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.ConvertProto;
import com.leaf.profile.dto.UserProfileIntroduceDTO;
import java.util.ArrayList;

public class UserProfileIntroduceGrpcMapper {

    private static final UserProfileIntroduceGrpcMapper INSTANCE = new UserProfileIntroduceGrpcMapper();

    private UserProfileIntroduceGrpcMapper() {}

    public static UserProfileIntroduceGrpcMapper getInstance() {
        return INSTANCE;
    }

    public com.leaf.common.grpc.UserProfileIntroduceDTO toGrpcUserProfileIntroduceDTO(
        UserProfileIntroduceDTO response
    ) {
        if (response == null) {
            return null;
        }
        var builder = com.leaf.common.grpc.UserProfileIntroduceDTO.newBuilder()
            .setId(CommonUtils.getSafeObject(response.getId(), String.class, ""))
            .setUserId(CommonUtils.getSafeObject(response.getUserId(), String.class, ""))
            .setCity(CommonUtils.getSafeObject(response.getCity(), String.class, ""))
            .setHometown(CommonUtils.getSafeObject(response.getHometown(), String.class, ""))
            .setJobTitle(CommonUtils.getSafeObject(response.getJobTitle(), String.class, ""))
            .setCompany(CommonUtils.getSafeObject(response.getCompany(), String.class, ""))
            .setSchool(CommonUtils.getSafeObject(response.getSchool(), String.class, ""))
            .setWebsiteUrl(CommonUtils.getSafeObject(response.getWebsiteUrl(), String.class, ""))
            .setGithubUrl(CommonUtils.getSafeObject(response.getGithubUrl(), String.class, ""))
            .setLinkedinUrl(CommonUtils.getSafeObject(response.getLinkedinUrl(), String.class, ""))
            .setXUrl(CommonUtils.getSafeObject(response.getXUrl(), String.class, ""))
            .setInstagramUrl(CommonUtils.getSafeObject(response.getInstagramUrl(), String.class, ""))
            .setTiktokUrl(CommonUtils.getSafeObject(response.getTiktokUrl(), String.class, ""))
            .setFacebookUrl(CommonUtils.getSafeObject(response.getFacebookUrl(), String.class, ""))
            .setGender(CommonUtils.getSafeObject(response.getGender(), Gender.class, Gender.GENDER_UNSPECIFIED))
            .setRelationshipStatus(
                CommonUtils.getSafeObject(
                    response.getRelationshipStatus(),
                    RelationshipStatus.class,
                    RelationshipStatus.RELATIONSHIP_STATUS_SINGLE
                )
            )
            .setPhoneNumber(CommonUtils.getSafeObject(response.getPhoneNumber(), String.class, ""))
            .addAllInterests(
                response.getInterests() != null
                    ? response.getInterests().stream().map(this::toGrpcInterestDTO).toList()
                    : new ArrayList<>()
            );

        Timestamp dobTimestamp = ConvertProto.convertLocalDateToTimestamp(response.getDob());
        if (dobTimestamp != null) {
            builder.setDob(dobTimestamp);
        }

        return builder.build();
    }

    public com.leaf.common.grpc.InterestDTO toGrpcInterestDTO(com.leaf.profile.dto.InterestDTO interest) {
        if (interest == null) {
            return null;
        }
        var builder = com.leaf.common.grpc.InterestDTO.newBuilder()
            .setId(CommonUtils.getSafeObject(interest.getId(), String.class, ""))
            .setTitle(CommonUtils.getSafeObject(interest.getTitle(), String.class, ""))
            .setColor(CommonUtils.getSafeObject(interest.getColor(), String.class, ""))
            .setCode(CommonUtils.getSafeObject(interest.getCode(), String.class, ""))
            .setCreatedBy(CommonUtils.getSafeObject(interest.getCreatedBy(), String.class, ""))
            .setModifiedBy(CommonUtils.getSafeObject(interest.getModifiedBy(), String.class, ""));

        var createdDateTimestamp = ConvertProto.convertInstantToTimestamp(interest.getCreatedDate());
        if (createdDateTimestamp != null) {
            builder.setCreatedDate(createdDateTimestamp);
        }

        var modifiedDateTimestamp = ConvertProto.convertInstantToTimestamp(interest.getModifiedDate());
        if (modifiedDateTimestamp != null) {
            builder.setModifiedDate(modifiedDateTimestamp);
        }

        return builder.build();
    }
}

package com.leaf.profile.mapper;

import com.google.protobuf.Timestamp;
import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.RelationshipStatus;
import com.leaf.framework.blocking.util.CommonUtil;
import com.leaf.framework.blocking.util.ConvertProto;
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
            .setId(CommonUtil.getSafeObject(response.getId(), String.class, ""))
            .setUserId(CommonUtil.getSafeObject(response.getUserId(), String.class, ""))
            .setCity(CommonUtil.getSafeObject(response.getCity(), String.class, ""))
            .setHometown(CommonUtil.getSafeObject(response.getHometown(), String.class, ""))
            .setJobTitle(CommonUtil.getSafeObject(response.getJobTitle(), String.class, ""))
            .setCompany(CommonUtil.getSafeObject(response.getCompany(), String.class, ""))
            .setSchool(CommonUtil.getSafeObject(response.getSchool(), String.class, ""))
            .setWebsiteUrl(CommonUtil.getSafeObject(response.getWebsiteUrl(), String.class, ""))
            .setGithubUrl(CommonUtil.getSafeObject(response.getGithubUrl(), String.class, ""))
            .setLinkedinUrl(CommonUtil.getSafeObject(response.getLinkedinUrl(), String.class, ""))
            .setXUrl(CommonUtil.getSafeObject(response.getXUrl(), String.class, ""))
            .setInstagramUrl(CommonUtil.getSafeObject(response.getInstagramUrl(), String.class, ""))
            .setTiktokUrl(CommonUtil.getSafeObject(response.getTiktokUrl(), String.class, ""))
            .setFacebookUrl(CommonUtil.getSafeObject(response.getFacebookUrl(), String.class, ""))
            .setGender(CommonUtil.getSafeObject(response.getGender(), Gender.class, Gender.GENDER_UNSPECIFIED))
            .setRelationshipStatus(
                CommonUtil.getSafeObject(
                    response.getRelationshipStatus(),
                    RelationshipStatus.class,
                    RelationshipStatus.RELATIONSHIP_STATUS_SINGLE
                )
            )
            .setPhoneNumber(CommonUtil.getSafeObject(response.getPhoneNumber(), String.class, ""))
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
            .setId(CommonUtil.getSafeObject(interest.getId(), String.class, ""))
            .setTitle(CommonUtil.getSafeObject(interest.getTitle(), String.class, ""))
            .setColor(CommonUtil.getSafeObject(interest.getColor(), String.class, ""))
            .setCode(CommonUtil.getSafeObject(interest.getCode(), String.class, ""))
            .setCreatedBy(CommonUtil.getSafeObject(interest.getCreatedBy(), String.class, ""))
            .setModifiedBy(CommonUtil.getSafeObject(interest.getModifiedBy(), String.class, ""));

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

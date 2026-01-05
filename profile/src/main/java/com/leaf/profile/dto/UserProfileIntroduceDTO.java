package com.leaf.profile.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.RelationshipStatus;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.profile.domain.UserProfileIntroduce;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileIntroduceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
    String userId;
    String city;
    String hometown;
    String jobTitle;
    String company;
    String school;
    String websiteUrl;
    String githubUrl;
    String linkedinUrl;
    String xUrl;
    String instagramUrl;
    String tiktokUrl;
    String facebookUrl;

    @JsonSerialize(using = InstantToStringSerializer.class)
    LocalDate dob;

    Gender gender;
    RelationshipStatus relationshipStatus;
    String phoneNumber;
    List<InterestDTO> interests;

    public static UserProfileIntroduceDTO toUserProfileIntroduceDTO(UserProfileIntroduce userProfileIntroduce) {
        UserProfileIntroduceDTO.UserProfileIntroduceDTOBuilder builder = UserProfileIntroduceDTO.builder()
            .id(userProfileIntroduce.getId())
            .userId(userProfileIntroduce.getUserId())
            .city(userProfileIntroduce.getCity())
            .hometown(userProfileIntroduce.getHometown())
            .jobTitle(userProfileIntroduce.getJobTitle())
            .company(userProfileIntroduce.getCompany())
            .school(userProfileIntroduce.getSchool())
            .websiteUrl(userProfileIntroduce.getWebsiteUrl())
            .githubUrl(userProfileIntroduce.getGithubUrl())
            .linkedinUrl(userProfileIntroduce.getLinkedinUrl())
            .xUrl(userProfileIntroduce.getXUrl())
            .instagramUrl(userProfileIntroduce.getInstagramUrl())
            .tiktokUrl(userProfileIntroduce.getTiktokUrl())
            .facebookUrl(userProfileIntroduce.getFacebookUrl())
            .dob(userProfileIntroduce.getDob())
            .gender(userProfileIntroduce.getGender())
            .relationshipStatus(userProfileIntroduce.getRelationshipStatus())
            .phoneNumber(userProfileIntroduce.getPhoneNumber())
            .interests(
                userProfileIntroduce
                    .getInterests()
                    .stream()
                    .map(interest ->
                        InterestDTO.builder()
                            .id(interest.getId())
                            .title(interest.getTitle())
                            .color(interest.getColor())
                            .build()
                    )
                    .toList()
            );
        return builder.build();
    }
}

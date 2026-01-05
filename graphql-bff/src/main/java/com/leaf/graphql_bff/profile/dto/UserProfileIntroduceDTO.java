package com.leaf.graphql_bff.profile.dto;

import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.RelationshipStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileIntroduceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
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
    LocalDate dob;
    Gender gender;
    RelationshipStatus relationshipStatus;
    String phoneNumber;
    List<InterestDTO> interests;
}

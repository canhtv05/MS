package com.leaf.profile.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.grpc.GenderGrpc;
import com.leaf.common.grpc.RelationshipStatusGrpc;
import com.leaf.framework.blocking.util.json.LocalDateToStringSerializer;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
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
public class UpdateProfileIntroduceDTO {

    String city;
    String hometown;
    String jobTitle;
    String company;
    String school;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)*$",
        message = "Website URL is not valid"
    )
    String websiteUrl;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)*$",
        message = "GitHub URL is not valid"
    )
    String githubUrl;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)*$",
        message = "LinkedIn URL is not valid"
    )
    String linkedinUrl;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)*$",
        message = "X URL is not valid"
    )
    String xUrl;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)*$",
        message = "Instagram URL is not valid"
    )
    String instagramUrl;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)*$",
        message = "TikTok URL is not valid"
    )
    String tiktokUrl;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)*$",
        message = "Facebook URL is not valid"
    )
    String facebookUrl;

    @JsonSerialize(using = LocalDateToStringSerializer.class)
    @Past(message = "Date of birth must be in the past")
    LocalDate dob;

    @Builder.Default
    GenderGrpc gender = GenderGrpc.GENDER_UNSPECIFIED;

    @Builder.Default
    RelationshipStatusGrpc relationshipStatus = RelationshipStatusGrpc.RELATIONSHIP_STATUS_SINGLE;

    @Pattern(regexp = "^\\d{9,15}$", message = "Phone number must be between 9 and 15 digits")
    String phoneNumber;
}

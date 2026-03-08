package com.leaf.profile.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.leaf.common.grpc.PrivacyLevelGrpc;
import com.leaf.profile.domain.UserProfilePrivacy;
import java.io.Serializable;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrivacyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    PrivacyLevelGrpc profileVisibility;
    PrivacyLevelGrpc friendsVisibility;
    PrivacyLevelGrpc postsVisibility;
    PrivacyLevelGrpc introduceVisibility;
    PrivacyLevelGrpc galleryVisibility;

    public static PrivacyDTO toPrivacyDTO(UserProfilePrivacy userProfilePrivacy) {
        return PrivacyDTO.builder()
            .profileVisibility(userProfilePrivacy.getProfileVisibility())
            .friendsVisibility(userProfilePrivacy.getFriendsVisibility())
            .postsVisibility(userProfilePrivacy.getPostsVisibility())
            .introduceVisibility(userProfilePrivacy.getIntroduceVisibility())
            .galleryVisibility(userProfilePrivacy.getGalleryVisibility())
            .build();
    }
}

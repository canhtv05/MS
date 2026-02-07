package com.leaf.profile.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.leaf.common.grpc.PrivacyLevel;
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
public class UserProfilePrivacyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
    String userId;
    PrivacyLevel profileVisibility;
    PrivacyLevel friendsVisibility;
    PrivacyLevel postsVisibility;
    PrivacyLevel introduceVisibility;
    PrivacyLevel galleryVisibility;

    public static UserProfilePrivacyDTO toUserProfilePrivacyDTO(UserProfilePrivacy userProfilePrivacy) {
        UserProfilePrivacyDTO.UserProfilePrivacyDTOBuilder builder = UserProfilePrivacyDTO.builder()
            .id(userProfilePrivacy.getId())
            .userId(userProfilePrivacy.getUserId())
            .profileVisibility(userProfilePrivacy.getProfileVisibility())
            .friendsVisibility(userProfilePrivacy.getFriendsVisibility())
            .postsVisibility(userProfilePrivacy.getPostsVisibility())
            .introduceVisibility(userProfilePrivacy.getIntroduceVisibility())
            .galleryVisibility(userProfilePrivacy.getGalleryVisibility());
        return builder.build();
    }
}

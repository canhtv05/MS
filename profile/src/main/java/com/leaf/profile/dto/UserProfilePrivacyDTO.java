package com.leaf.profile.dto;

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
public class UserProfilePrivacyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
    String userId;
    PrivacyLevel profileVisibility;
    PrivacyLevel friendsVisibility;
    PrivacyLevel postsVisibility;

    public static UserProfilePrivacyDTO toUserProfilePrivacyDTO(UserProfilePrivacy userProfilePrivacy) {
        UserProfilePrivacyDTO.UserProfilePrivacyDTOBuilder builder = UserProfilePrivacyDTO.builder()
            .id(userProfilePrivacy.getId())
            .userId(userProfilePrivacy.getUserId())
            .profileVisibility(userProfilePrivacy.getProfileVisibility())
            .friendsVisibility(userProfilePrivacy.getFriendsVisibility())
            .postsVisibility(userProfilePrivacy.getPostsVisibility());
        return builder.build();
    }
}

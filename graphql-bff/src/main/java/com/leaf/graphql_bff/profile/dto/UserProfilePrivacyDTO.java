package com.leaf.graphql_bff.profile.dto;

import com.leaf.common.grpc.PrivacyLevel;
import java.io.Serializable;
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
public class UserProfilePrivacyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
    String userId;
    PrivacyLevel profileVisibility;
    PrivacyLevel friendsVisibility;
    PrivacyLevel postsVisibility;
    PrivacyLevel introduceVisibility;
    PrivacyLevel galleryVisibility;
}

package com.leaf.profile.dto;

import com.leaf.common.grpc.PrivacyLevel;
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
public class UpdatePrivacyReq implements Serializable {

    private static final long serialVersionUID = 1L;

    PrivacyLevel profileVisibility;
    PrivacyLevel friendsVisibility;
    PrivacyLevel postsVisibility;
}

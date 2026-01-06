package com.leaf.graphql_bff.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {

    private String id;
    private String userId;
    private String fullname;
    private String bio;
    private String coverUrl;
    private String avatarUrl;
    private String createdDate;
    private String lastOnlineAt;
    private Long followersCount;
    private Long followingCount;
}

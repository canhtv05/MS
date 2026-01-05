package com.leaf.graphql_bff.profile.dto;

import java.io.Serializable;
import java.util.List;
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
public class AuthMeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String username;
    private String email;
    private Boolean isGlobal;
    private List<String> roles;
    private List<String> roleLabels;
    private List<String> permissions;
    private String secretKey;
    private String channel;
}

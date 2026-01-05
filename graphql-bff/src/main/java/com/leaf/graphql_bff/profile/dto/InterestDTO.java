package com.leaf.graphql_bff.profile.dto;

import java.io.Serializable;
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
public class InterestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String title;
    private String color;
}

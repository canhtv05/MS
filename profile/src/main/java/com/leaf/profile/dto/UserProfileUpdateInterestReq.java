package com.leaf.profile.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileUpdateInterestReq implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private List<String> interestIds;
}

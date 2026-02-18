package com.leaf.profile.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateBioAndFullnameProfileReq implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String bio;

    @NotBlank(message = "Fullname is required")
    @Pattern(
        regexp = "^[\\p{L}]+ [\\p{L}]+( [\\p{L}]+)*$",
        message = "Fullname must be valid fullname. It must contain at least 2 words and no special characters"
    )
    @Size(min = 3, max = 255, message = "Fullname must be between 3 and 255 characters")
    private String fullname;
}

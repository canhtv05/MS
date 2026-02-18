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
public class CreateInterestReq implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "title is not blank")
    @Size(max = 50, message = "title must be less than 50 characters")
    private String title;

    @NotBlank(message = "color is not blank")
    @Size(min = 7, max = 9, message = "color must be 7-9 characters")
    @Pattern(regexp = "^#([0-9a-fA-F]{6,8})$", message = "color must be a valid hex color")
    private String color;
}

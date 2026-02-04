package com.leaf.profile.dto;

import com.leaf.profile.domain.Interest;
import java.io.Serializable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.BeanUtils;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InterestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
    String title;
    String color;

    public static InterestDTO toInterestDTO(Interest source) {
        InterestDTO target = new InterestDTO();
        BeanUtils.copyProperties(source, target);
        return target;
    }
}

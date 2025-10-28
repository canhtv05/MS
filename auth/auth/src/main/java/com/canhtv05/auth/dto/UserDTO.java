package com.canhtv05.auth.dto;

import com.canhtv05.auth.domain.Role;
import com.canhtv05.auth.domain.User;
import com.canhtv05.common.utils.json.InstantToStringSerializer;
import com.canhtv05.common.utils.json.LowerCaseTrimDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    private String username;
    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    private String login;
    private String fullName;
    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    private String email;
    private String phone;
    private boolean activated;
    private String imageUrl;
    private Boolean isGlobal;
    private List<String> roles;
    private List<String> roleLabels;

    @JsonSerialize(using = InstantToStringSerializer.class)
    private Instant createdDate;
    @JsonSerialize(using = InstantToStringSerializer.class)
    private Instant modifiedDate;

    private String employeeCode;

    public UserDTO(User entity) {
        this.id = entity.getId();
        this.username = entity.getUsername();
        this.fullName = entity.getFullName();
        this.email = entity.getEmail();
        this.phone = entity.getPhone();
        this.activated = entity.isActivated();
        this.imageUrl = entity.getImageUrl();
        this.isGlobal = entity.getIsGlobal();
    }

    public static UserDTO fromEntity(User entity) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(entity, dto);
        dto.setRoles(entity.getRoles().stream().map(Role::getCode).collect(Collectors.toList()));
        dto.setRoleLabels(entity.getRoles().stream().map(Role::getDescription).collect(Collectors.toList()));
        return dto;
    }

}

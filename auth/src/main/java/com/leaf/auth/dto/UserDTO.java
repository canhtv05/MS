package com.leaf.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.auth.domain.Role;
import com.leaf.auth.domain.User;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.common.utils.json.LowerCaseTrimDeserializer;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String fullname;

    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    private String username;

    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    private String password;

    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    private String email;

    private boolean activated;
    private Boolean isGlobal;
    private List<String> roles;
    private List<String> roleLabels;

    @JsonSerialize(using = InstantToStringSerializer.class)
    private Instant createdDate;

    @JsonSerialize(using = InstantToStringSerializer.class)
    private Instant modifiedDate;

    public UserDTO(User entity) {
        this.id = entity.getId();
        this.username = entity.getUsername();
        this.activated = entity.isActivated();
        this.isGlobal = entity.getIsGlobal();
        this.password = entity.getPassword();
        this.email = entity.getEmail();
    }

    public static UserDTO fromEntity(User entity) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(entity, dto);
        dto.setRoles(entity.getRoles().stream().map(Role::getCode).collect(Collectors.toList()));
        dto.setRoleLabels(entity.getRoles().stream().map(Role::getDescription).collect(Collectors.toList()));
        dto.setPassword(null);
        dto.setEmail(entity.getEmail());
        dto.setFullname(entity.getFullName());
        return dto;
    }
}

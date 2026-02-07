package com.leaf.noti.dto;

import com.leaf.noti.enums.VerificationStatus;
import java.io.Serial;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerifyEmailTokenRes implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private boolean valid;
    private VerificationStatus verificationStatus;
}

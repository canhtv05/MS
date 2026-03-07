package com.leaf.common.socket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class WsSessionRevokedMessage {

    private String tokenSessionValid;
    private String tokenSessionCurrent;
    private String channelType;
}

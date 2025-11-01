package com.canhtv05.auth.enums;

import lombok.Getter;

@Getter
public enum AuthKey {
  ACCESS_TOKEN("accessToken"),
  REFRESH_TOKEN("refreshToken"),
  ;

  private final String key;

  AuthKey(String key) {
    this.key = key;
  }
}

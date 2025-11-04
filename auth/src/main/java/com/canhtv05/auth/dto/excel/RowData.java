package com.canhtv05.auth.dto.excel;

import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class RowData<T> {

    private final T data; // 1-based hiển thị cho user
    private final Map<String, String> fieldErrors = new LinkedHashMap<>();

    public RowData(T data) {
        this.data = data;
    }

    public void addFieldError(String field, String message) {
        fieldErrors.put(field, message);
    }

    public boolean hasErrors() {
        return !fieldErrors.isEmpty();
    }
}

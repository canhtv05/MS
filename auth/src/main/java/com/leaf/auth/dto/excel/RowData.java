package com.leaf.auth.dto.excel;

import java.util.LinkedHashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

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

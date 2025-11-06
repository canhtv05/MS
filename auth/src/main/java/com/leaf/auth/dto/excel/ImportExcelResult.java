package com.leaf.auth.dto.excel;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class ImportExcelResult<T> {

    private final List<RowHeader> headers = new ArrayList<>();
    private final List<RowData<T>> rows = new ArrayList<>();

    public boolean isHasErrors() {
        return !rows.isEmpty();
    }
}

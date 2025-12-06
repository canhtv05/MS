package com.leaf.auth.dto.excel;

import java.util.List;
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
public class ExcelTemplateConfig {

    private List<String> headers;
    private List<Integer> fieldRequired;
    private boolean autoNumber;
    private List<ExcelValidation> listValidations;

    @Getter
    @Setter
    @SuperBuilder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExcelValidation {

        private String rangeName;
        private int rowIndex;
        private List<String> data;
    }
}

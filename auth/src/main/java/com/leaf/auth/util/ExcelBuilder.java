package com.leaf.auth.util;

import com.leaf.auth.dto.excel.ExcelTemplateConfig;
import com.leaf.auth.dto.excel.ReadExcelResult;
import com.leaf.auth.dto.excel.RowHeader;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.DateUtils;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.IntStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.web.multipart.MultipartFile;

public class ExcelBuilder {

    public static byte[] buildFileTemplate(ExcelTemplateConfig config) {
        try (
            XSSFWorkbook wb = new XSSFWorkbook();
            ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {
            Sheet main = wb.createSheet("DataImport");

            CellStyle headerStyle = ExcelBuilder.createHeaderStyle(wb);
            XSSFFont redFont = wb.createFont();
            redFont.setColor(IndexedColors.RED.getIndex());

            // Tạo header
            List<String> headers = new ArrayList<>(config.getHeaders());
            if (config.isAutoNumber()) {
                headers.addFirst("#");
            }
            Row headerRow = main.createRow(0);
            IntStream.range(0, headers.size()).forEach(i -> {
                createHeaderCell(
                    headerRow,
                    i,
                    headers.get(i),
                    config.getFieldRequired().contains(i),
                    headerStyle,
                    redFont
                );
            });

            // Tạo STT data
            if (config.isAutoNumber()) {
                IntStream.range(0, 10).forEach(i -> {
                    Row row = main.createRow(i + 1);
                    Cell stt = row.createCell(0);
                    stt.setCellValue(i + 1);
                    stt.setCellStyle(headerStyle);
                });
            }

            if (!config.getListValidations().isEmpty()) {
                // 1) Tạo sheet ẩn chứa nguồn dropdown
                Sheet hidden = wb.createSheet("__lists");

                IntStream.range(0, config.getListValidations().size()).forEach(i -> {
                    ExcelTemplateConfig.ExcelValidation dto = config.getListValidations().get(i);

                    ExcelBuilder.fillListColumn(hidden, i, dto.getData()); // cột A

                    // 2) Tạo Named Range cho từng danh sách
                    ExcelBuilder.createNamedRange(
                        wb,
                        dto.getRangeName(),
                        getRefRange(i, dto.getData().size())
                    );

                    // 3) Gán Data Validation cho các cột
                    int firstRow = 1,
                        lastRow = 100;

                    // 3.1 Dropdown Loại KH cho cột PlanType
                    ExcelBuilder.addNamedListValidation(
                        main,
                        firstRow,
                        lastRow,
                        dto.getRowIndex(),
                        dto.getRangeName()
                    );
                });

                // 5) Ẩn sheet nguồn
                hidden.protectSheet(DateUtils.getCurrentDate());
                int hiddenIndex = wb.getSheetIndex(hidden);
                wb.setSheetHidden(hiddenIndex, true);
            }
            IntStream.range(1, headers.size()).forEach(main::autoSizeColumn);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR, e.getMessage());
        }
    }

    public static ReadExcelResult readFileExcel(MultipartFile file, List<RowHeader> headers) {
        ReadExcelResult result = ReadExcelResult.builder().build();

        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(wb.getSheetIndex("DataImport"));
            List<Map<String, String>> fileData = new ArrayList<>();
            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) {
                    continue;
                }

                Map<String, String> rowData = new HashMap<>();
                // Đọc & map từng cột
                headers.forEach(header -> {
                    rowData.put(header.key(), ExcelBuilder.readString(row, header.colIndex()));
                });
                if (rowData.values().stream().anyMatch(StringUtils::isNotBlank)) {
                    fileData.add(rowData);
                }
            }
            result.setData(fileData);
            if (fileData.isEmpty()) {
                throw new ApiException(ErrorMessage.IMPORT_EXCEL_ERROR, "File không có dữ liệu.");
            }
        } catch (Exception e) {
            if (e instanceof ApiException ex) {
                throw ex;
            }
            throw new ApiException(
                ErrorMessage.IMPORT_EXCEL_ERROR,
                "Lỗi xử lý file lỗi: " + e.getMessage()
            );
        }
        return result;
    }

    private static String getRefRange(int index, int dataSize) {
        List<String> letters = Arrays.asList("A", "B", "C", "D", "E", "F", "G", "H", "I", "J");
        return "__lists!$_letter$1:$_letter$".replaceAll("_letter", letters.get(index)) + dataSize;
    }

    private static void createHeaderCell(
        Row headerRow,
        int index,
        String value,
        boolean required,
        CellStyle style,
        XSSFFont redFont
    ) {
        Cell h = headerRow.createCell(index);
        h.setCellValue(value);
        h.setCellStyle(style);
        if (required) {
            XSSFRichTextString richText = new XSSFRichTextString(value + "*");
            richText.applyFont(value.length(), value.length() + 1, redFont);
            h.setCellValue(richText);
        }
    }

    private static void fillListColumn(Sheet sheet, int col, List<String> data) {
        for (int i = 0; i < data.size(); i++) {
            Row r = sheet.getRow(i);
            if (r == null) r = sheet.createRow(i);
            r.createCell(col).setCellValue(data.get(i));
        }
    }

    private static void createNamedRange(XSSFWorkbook wb, String name, String ref) {
        XSSFName named = wb.createName();
        named.setNameName(name);
        named.setRefersToFormula(ref);
    }

    private static void addNamedListValidation(
        Sheet sheet,
        int firstRow,
        int lastRow,
        int col,
        String namedRange
    ) {
        XSSFDataValidationHelper helper = new XSSFDataValidationHelper((XSSFSheet) sheet);
        DataValidationConstraint constraint = helper.createFormulaListConstraint(namedRange);
        CellRangeAddressList range = new CellRangeAddressList(firstRow, lastRow, col, col);
        DataValidation validation = helper.createValidation(constraint, range);

        // Tránh warning Excel mới
        if (validation instanceof XSSFDataValidation xssfVal) {
            xssfVal.setSuppressDropDownArrow(true);
            xssfVal.setShowErrorBox(true);
        }
        sheet.addValidationData(validation);
    }

    public static CellStyle createHeaderStyle(Workbook wb) {
        CellStyle headerStyle = wb.createCellStyle();
        Font bold = wb.createFont();
        bold.setBold(true);
        headerStyle.setFont(bold);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        return headerStyle;
    }

    public static void createHeaderRow(Sheet sheet, CellStyle style, List<String> headers) {
        Row headerRow = sheet.createRow(0);
        IntStream.range(0, headers.size()).forEach(i -> {
            Cell h = headerRow.createCell(i);
            h.setCellValue(headers.get(i));
            h.setCellStyle(style);
        });
    }

    public static String readString(Row row, Integer colIndex) {
        Cell c = row.getCell(colIndex);
        if (c == null) {
            return null;
        }
        return StringUtils.defaultIfBlank(readCellAsString(c).trim(), null);
    }

    private static String readCellAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    var ld = cell
                        .getDateCellValue()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                    yield ld.toString();
                } else {
                    yield String.valueOf(cell.getNumericCellValue());
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> {
                try {
                    yield cell.getStringCellValue();
                } catch (Exception e) {
                    try {
                        yield String.valueOf(cell.getNumericCellValue());
                    } catch (Exception e2) {
                        yield "";
                    }
                }
            }
            default -> "";
        };
    }
}

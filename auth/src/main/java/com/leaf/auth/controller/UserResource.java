package com.leaf.auth.controller;

import com.leaf.auth.dto.ImportUserDTO;
import com.leaf.auth.dto.UserDTO;
import com.leaf.auth.dto.UserPermissionDTO;
import com.leaf.auth.dto.excel.ImportExcelResult;
import com.leaf.auth.dto.search.SearchRequest;
import com.leaf.auth.dto.search.SearchResponse;
import com.leaf.auth.enums.PermissionAction;
import com.leaf.auth.service.UserService;
import com.leaf.common.dto.ResponseObject;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class UserResource {

    private final UserService userService;

    @PostMapping("/users/r/search-datatable")
    public ResponseEntity<ResponseObject<SearchResponse<UserDTO>>> search(@ModelAttribute SearchRequest criteria) {
        SearchResponse<UserDTO> result = userService.searchDatatable(criteria);
        return ResponseEntity.ok(ResponseObject.success(result));
    }

    @GetMapping("/users/r/{id}")
    public ResponseEntity<ResponseObject<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO result = userService.findById(id);
        return ResponseEntity.ok(ResponseObject.success(result));
    }

    @PostMapping("/users/c/create")
    public ResponseEntity<ResponseObject<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO newUserDTO = userService.createUser(userDTO, true);
        return ResponseEntity.ok(ResponseObject.success(newUserDTO));
    }

    @PutMapping("/users/u/update")
    public ResponseEntity<ResponseObject<UserDTO>> updateUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(userDTO);
        return ResponseEntity.ok(ResponseObject.success(updatedUser));
    }

    @GetMapping("/users/u/lock/{id}")
    public ResponseEntity<ResponseObject<Boolean>> lockUser(@PathVariable Long id) {
        userService.changeLockUser(id, true);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @GetMapping("/users/u/unlock/{id}")
    public ResponseEntity<ResponseObject<Boolean>> unlockUser(@PathVariable Long id) {
        userService.changeLockUser(id, false);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/users/r/export")
    public ResponseEntity<byte[]> exportUser(@RequestBody SearchRequest request) {
        String filename = "export-user-" + LocalDate.now() + ".xlsx";
        byte[] file = userService.exportUser(request);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(file);
    }

    @GetMapping("/users/c/file-template")
    public ResponseEntity<byte[]> downloadFileTemplate() {
        String filename = "user-import-template.xlsx";
        byte[] file = userService.downloadTemplate();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(file);
    }

    @PostMapping("/users/c/import")
    public ResponseEntity<ResponseObject<ImportExcelResult<ImportUserDTO>>> importUser(
        @RequestPart("file") MultipartFile file
    ) {
        ImportExcelResult<ImportUserDTO> result = userService.importUser(file);
        return ResponseEntity.ok(ResponseObject.success(result));
    }

    @GetMapping("/user-permission/r/{id}")
    public ResponseEntity<ResponseObject<Map<String, PermissionAction>>> getUserPermission(@PathVariable Long id) {
        Map<String, PermissionAction> result = userService.getUserPermissions(id);
        return ResponseEntity.ok(ResponseObject.success(result));
    }

    @PostMapping("/user-permission/u/{id}")
    public ResponseEntity<ResponseObject<Boolean>> updateUserPermission(
        @PathVariable Long id,
        @RequestBody List<UserPermissionDTO> request
    ) {
        userService.updateUserPermission(id, request);
        return ResponseEntity.ok(ResponseObject.success());
    }
}

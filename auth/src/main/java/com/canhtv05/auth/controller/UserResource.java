package com.canhtv05.auth.controller;

import com.canhtv05.auth.dto.UserDTO;
import com.canhtv05.auth.service.UserService;
import com.canhtv05.common.exceptions.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class UserResource {

    private final UserService userService;

//    @PostMapping("/users/r/search-datatable")
//    public ResponseEntity<ResponseObject<SearchResponse<UserDTO>>> search(@ModelAttribute SearchRequest criteria) {
//        SearchResponse<UserDTO> result = userService.searchDatatable(criteria);
//        return ResponseEntity.ok(ResponseObject.success(result));
//    }

    @GetMapping("/users/r/{id}")
    public ResponseEntity<ResponseObject<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO result = userService.findById(id);
        return ResponseEntity.ok(ResponseObject.success(result));
    }

    @PostMapping("/users/c/create")
    public ResponseEntity<ResponseObject<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO newUserDTO = userService.createUser(userDTO);
        return ResponseEntity.ok(ResponseObject.success(newUserDTO));
    }

    @PutMapping("/users/u/update")
    public ResponseEntity<ResponseObject<UserDTO>> updateUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(userDTO);
        return ResponseEntity.ok(ResponseObject.success(updatedUser));
    }

    @GetMapping("/users/u/deactivate/{id}")
    public ResponseEntity<ResponseObject<Boolean>> deactivateTenant(@PathVariable Long id) {
        userService.changeActiveUser(id, false);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @GetMapping("/users/u/activate/{id}")
    public ResponseEntity<ResponseObject<Boolean>> activateTenant(@PathVariable Long id) {
        userService.changeActiveUser(id, true);
        return ResponseEntity.ok(ResponseObject.success());
    }

//    @PostMapping("/users/r/export")
//    public ResponseEntity<byte[]> exportUser(@RequestBody SearchRequest request) {
//        String filename = "export-user-" + LocalDate.now() + ".xlsx";
//        byte[] file = userService.exportUser(request);
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
//                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
//                .body(file);
//    }

//    @GetMapping("/users/c/file-template")
//    public ResponseEntity<byte[]> downloadFileTemplate(@RequestParam("tenantId") String tenantId) {
//        if (!SecurityUtils.isGlobalUser() || StringUtils.isEmpty(tenantId)) {
//            tenantId = TenantContext.getCurrentTenant();
//        }
//        String filename = tenantId.toLowerCase() + "_user-import-template.xlsx";
//        byte[] file = userService.downloadTemplate(tenantId);
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
//                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
//                .body(file);
//    }
//
//    @PostMapping("/users/c/import")
//    public ResponseEntity<ResponseObject<ImportExcelResult<ImportUserDTO>>> importUser(@RequestPart("file") MultipartFile file,
//                                                                                       @RequestParam("tenantId") String tenantId) {
//        ImportExcelResult<ImportUserDTO> result = userService.importUser(file, tenantId);
//        return ResponseEntity.ok(ResponseObject.success(result));
//    }
//
//    @GetMapping("/user-permission/r/{id}")
//    public ResponseEntity<ResponseObject<Map<String, PermissionAction>>> getUserPermission(@PathVariable Long id) {
//        Map<String, PermissionAction> result = userService.getUserPermissions(id);
//        return ResponseEntity.ok(ResponseObject.success(result));
//    }
//
//    @PostMapping("/user-permission/u/{id}")
//    public ResponseEntity<ResponseObject<Boolean>> updateUserPermission(@PathVariable Long id,
//                                                                        @RequestBody List<UserPermissionDTO> request) {
//        userService.updateUserPermission(id, request);
//        return ResponseEntity.ok(ResponseObject.success());
//    }
//
//    @GetMapping("/user-employee/r/{id}")
//    public ResponseEntity<ResponseObject<EmployeeSelect>> getUserEmployee(@PathVariable Long id) {
//
//        return ResponseEntity.ok(ResponseObject.success(userService.getEmployee(id)));
//    }
//    @PostMapping("/user-employee/c")
//    public ResponseEntity<ResponseObject<Boolean>> mappingEmployeeIntoUser(@RequestBody Map<String,String> request) {
//            userService.mappingEmployeetoUser(Long.parseLong(request.get("userId")),request.get("employeeCode"));
//            return ResponseEntity.ok(ResponseObject.success());
//    }

}

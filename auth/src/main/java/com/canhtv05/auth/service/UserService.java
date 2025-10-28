package com.canhtv05.auth.service;

import com.canhtv05.auth.domain.User;
import com.canhtv05.auth.dto.ChangePasswordReq;
import com.canhtv05.auth.dto.UserDTO;
import com.canhtv05.auth.dto.UserProfileDTO;
import com.canhtv05.auth.repository.RoleRepository;
import com.canhtv05.auth.repository.UserPermissionRepository;
import com.canhtv05.auth.repository.UserRepository;

import com.canhtv05.common.exceptions.ApiException;
import com.canhtv05.common.exceptions.ErrorMessage;
import com.canhtv05.common.security.SecurityUtils;
import com.canhtv05.common.utils.CommonUtils;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final ValidatorFactory validator = Validation.buildDefaultValidatorFactory();
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final AuthService authService;

    public UserDTO findById(Long id) {
        return userRepository.findById(id).map(UserDTO::new)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
    }

    public UserDTO createUser(UserDTO request) {
        if (userRepository.existsUserByUsername(request.getUsername())) {
            throw new ApiException(ErrorMessage.USERNAME_ALREADY_EXITS);
        }
        User user = User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .imageUrl(request.getImageUrl())
                .activated(request.isActivated())
                .isGlobal(request.getIsGlobal())
                .build();

        String encryptedPassword = passwordEncoder.encode(request.getLogin());
        user.setPassword(encryptedPassword);
        if (ObjectUtils.isNotEmpty(request.getRoles())) {
            user.setRoles(new HashSet<>(roleRepository.findAllByCodeIn(request.getRoles())));
        }
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    public UserDTO updateUser(UserDTO request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        User user = optionalUser.get();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setImageUrl(request.getImageUrl());
        user.setActivated(request.isActivated());
        if (SecurityUtils.isGlobalUser()) {
            user.setIsGlobal(request.getIsGlobal());
        }
        user.setRoles(new HashSet<>());
        if (ObjectUtils.isNotEmpty(request.getRoles())) {
            user.setRoles(new HashSet<>(roleRepository.findAllByCodeIn(request.getRoles())));
        }
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    public void changeActiveUser(Long id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
        user.setActivated(isActive);
        userRepository.save(user);
    }

    public void changePassword(ChangePasswordReq req) {
        if (CommonUtils.isEmpty(req.getCurrentPassword(), req.getNewPassword())) {
            throw new ApiException(ErrorMessage.VALIDATION_ERROR);
        }
        String userLogin = SecurityUtils.getCurrentUserLogin().get();
        Optional<User> optionalUser = userRepository.findByUsername(userLogin);
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new ApiException(ErrorMessage.CURRENT_PASSWORD_INVALID);
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    public void updateUserProfile(UserProfileDTO request) {
        String userLogin = SecurityUtils.getCurrentUserLogin().get();
        Optional<User> optionalUser = userRepository.findByUsername(userLogin);
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        User user = optionalUser.get();
        if (StringUtils.isNotBlank(request.getFullName())) {
            user.setFullName(request.getFullName());
        }
        if (StringUtils.isNotBlank(request.getPhone())) {
            user.setPhone(request.getPhone());
        }
        if (StringUtils.isNotBlank(request.getEmail())) {
            user.setEmail(request.getEmail());
        }
        userRepository.save(user);
    }

    // @Transactional(readOnly = true)
    // public SearchResponse<UserDTO> searchDatatable(SearchRequest request) {
    // Specification<User> spec = createSpecification(request);
    // Page<User> tenants = userRepository.findAll(spec, request.toPageable());
    // return new SearchResponse<>(
    // tenants.getContent().stream().map(UserDTO::fromEntity).collect(Collectors.toList()),
    // tenants.getTotalElements()
    // );
    // }
    //
    // private Specification<User> createSpecification(SearchRequest criteria) {
    // return (root, query, cb) -> {
    // List<Predicate> predicates = new ArrayList<>();
    // if (StringUtils.isNotBlank(criteria.searchText())) {
    // predicates.add(cb.or(
    // cb.like(cb.lower(root.get("username")), "%" +
    // criteria.searchText().toLowerCase() + "%"),
    // cb.like(cb.lower(root.get("fullName")), "%" +
    // criteria.searchText().toLowerCase() + "%"),
    // cb.like(cb.lower(root.get("email")), "%" +
    // criteria.searchText().toLowerCase() + "%"),
    // cb.like(cb.lower(root.get("phone")), "%" +
    // criteria.searchText().toLowerCase() + "%")
    // ));
    // }
    // if (SecurityUtils.isGlobalUser() &&
    // StringUtils.isNotBlank(criteria.tenantId())) {
    // predicates.add(cb.equal(root.get("tenantId"), criteria.tenantId()));
    // }
    // return cb.and(predicates.toArray(new Predicate[0]));
    // };
    // }
    //
    // @Transactional(readOnly = true)
    // public byte[] exportUser(SearchRequest request) {
    // Specification<User> spec = createSpecification(request);
    // List<User> data = userRepository.findAll(spec, Sort.by(Sort.Direction.ASC,
    // "id"));
    // List<String> headers = List.of("#", "Tên đăng nhập", "Tên", "Email", "Phone",
    // "Trạng thái", "Tenant", "Ngày tạo");
    // try (XSSFWorkbook wb = new XSSFWorkbook();
    // ByteArrayOutputStream out = new ByteArrayOutputStream()
    // ) {
    // Sheet sheet = wb.createSheet("Data");
    // CellStyle headerStyle = ExcelBuilder.createHeaderStyle(wb);
    // ExcelBuilder.createHeaderRow(sheet, headerStyle, headers);
    // int r = 1;
    // for (User item : data) {
    // Row row = sheet.createRow(r);
    // Cell stt = row.createCell(0);
    // stt.setCellValue(r);
    // stt.setCellStyle(headerStyle);
    //
    // row.createCell(1).setCellValue(item.getUsername());
    // row.createCell(2).setCellValue(item.getFullName());
    // row.createCell(3).setCellValue(item.getEmail());
    // row.createCell(4).setCellValue(item.getPhone());
    // row.createCell(5).setCellValue(item.isActivated() ? "Hoạt động" : "Không hoạt
    // động");
    // row.createCell(7).setCellValue(DateUtils.dateToString(item.getCreatedDate()));
    // r++;
    // }
    // IntStream.range(1, headers.size()).forEach(sheet::autoSizeColumn);
    // wb.write(out);
    // return out.toByteArray();
    // } catch (Exception e) {
    // throw new ApiException(ErrorMessage.UNHANDLED_ERROR, e.getMessage());
    // }
    // }
    //
    // public byte[] downloadTemplate(String tenantId) {
    //// if (!SecurityUtils.isGlobalUser() || StringUtils.isEmpty(tenantId)) {
    //// tenantId = TenantContext.getCurrentTenant();
    //// }
    //// Optional<Tenant> optionalTenant = tenantRepository.findByCode(tenantId);
    //// if (optionalTenant.isEmpty()) {
    //// throw new ApiException(ErrorMessage.TENANT_NOT_FOUND);
    //// }
    // List<String> roleCodes = roleRepository.findAllByTenantId(tenantId).stream()
    // .map(Role::getCode)
    // .filter(t -> !AuthoritiesConstants.SUPER_ADMIN.equalsIgnoreCase(t))
    // .collect(Collectors.toList());
    // ExcelTemplateConfig config = ExcelTemplateConfig.builder()
    // .headers(List.of("Tên đăng nhập", "Tên", "Email", "Số điện thoại", "Vai
    // trò"))
    // .fieldRequired(List.of(1, 2, 3))
    // .autoNumber(true)
    // .tenantId(tenantId)
    // .listValidations(new ArrayList<>())
    // .build();
    // config.getListValidations().add(ExcelTemplateConfig.ExcelValidation.builder()
    // .rangeName("_ROLE")
    // .rowIndex(5)
    // .data(roleCodes)
    // .build());
    // return ExcelBuilder.buildFileTemplate(config);
    // }
    //
    //
    //
    // public ImportExcelResult<ImportUserDTO> importUser(MultipartFile file, String
    // tenantId) {
    // if (!SecurityUtils.isGlobalUser() || StringUtils.isEmpty(tenantId)) {
    // tenantId = TenantContext.getCurrentTenant();
    // }
    // Optional<Tenant> optionalTenant = tenantRepository.findByCode(tenantId);
    // if (optionalTenant.isEmpty()) {
    // throw new ApiException(ErrorMessage.TENANT_NOT_FOUND);
    // }
    // ImportExcelResult<ImportUserDTO> result = new ImportExcelResult<>();
    // List<RowHeader> rowHeaders = List.of(
    // new RowHeader("Tên đăng nhập", "login", 1),
    // new RowHeader("Tên", "fullName", 2),
    // new RowHeader("Email", "email", 3),
    // new RowHeader("Số điện thoại", "phone", 4),
    // new RowHeader("Vai trò", "role", 5)
    // );
    // ReadExcelResult mapData = ExcelBuilder.readFileExcel(file, rowHeaders,
    // tenantId);
    // List<ImportUserDTO> fileData = mapData.getData().stream()
    // .map(item -> ImportUserDTO.fromExcelData(item, mapData.getTenantId()))
    // .collect(Collectors.toList());
    // result.getHeaders().addAll(rowHeaders);
    // List<String> usernames = fileData.stream()
    // .map(ImportUserDTO::getUsername)
    // .filter(StringUtils::isNotBlank).toList();
    // List<String> existingData = userRepository.findUserExitsUsername(usernames);
    // IntStream.range(0, fileData.size()).forEach(i -> {
    // ImportUserDTO dto = fileData.get(i);
    // RowData<ImportUserDTO> rowError = new RowData<>(dto);
    // Set<ConstraintViolation<ImportUserDTO>> violations =
    // validator.getValidator().validate(dto);
    // for (var v : violations) {
    // rowError.addFieldError(v.getPropertyPath().toString(), v.getMessage());
    // }
    // if (StringUtils.isNotBlank(dto.getUsername()) &&
    // existingData.contains(dto.getUsername())) {
    // rowError.addFieldError("login", "Tên đăng nhập đã tồn tại.");
    // }
    // if (rowError.hasErrors()) {
    // result.getRows().add(rowError);
    // }
    // });
    // if (!result.isHasErrors()) {
    // List<String> roleCodes =
    // fileData.stream().map(ImportUserDTO::getRole).toList();
    // List<Role> roleList = roleRepository.findAllByCodeIn(roleCodes);
    // List<User> users = fileData.stream()
    // .map(dto -> dto.toEntity(
    // passwordEncoder.encode(dto.getLogin()),
    // roleList.stream()
    // .filter(r -> r.getCode().equals(dto.getRole()))
    // .collect(Collectors.toSet())))
    // .toList();
    // userRepository.saveAll(users);
    // }
    // return result;
    // }
    //
    // public Map<String, PermissionAction> getUserPermissions(Long userId) {
    // List<UserPermissions> data =
    // userPermissionsRepository.findAllByUserId(userId);
    // return
    // data.stream().collect(Collectors.toMap(UserPermissions::getPermissionCode,
    // UserPermissions::getAction));
    // }
    //
    // @Transactional
    // public void updateUserPermission(Long userId, List<UserPermissionDTO>
    // request) {
    // userPermissionsRepository.deleteAllByUserId(userId);
    // userPermissionsRepository.saveAll(request.stream()
    // .map(item -> item.toEntity(userId))
    // .collect(Collectors.toSet()));
    // }
    // @Transactional(readOnly = true)
    //
    // public EmployeeSelect getEmployee(Long userId) {
    // Optional<User> optionalUser = userRepository.findById(userId);
    // if(optionalUser.isPresent()) {
    // User user = optionalUser.get();
    // EmployeeSelect employee=null;
    // if(user.getEmployee()!=null) {
    // employee = EmployeeSelect.fromEntity(user.getEmployee());
    // }
    // return employee;
    // }
    // return null;
    // }
    // @Transactional
    // public void mappingEmployeetoUser(Long id, String employeeCode){
    // User user=null;
    // if(userRepository.findById(id).isPresent()) {
    // user = userRepository.findById(id).get();
    // }
    //
    // Employee
    // employee=employeeRepository.findByEmployeeCode(employeeCode).orElseThrow(()
    // -> new ApiException(ErrorMessage.EMPLOYEE_NOT_FOUND));
    // assert user != null;
    // List<User> users =
    // userRepository.findByTenantId(TenantContext.getCurrentTenant());
    // List<String> employeeCodes = users.stream()
    // .map(User::getEmployee) // Lấy Employee từ User
    // .filter(Objects::nonNull) // Lọc những User không có Employee
    // .map(Employee::getEmployeeCode) // Lấy ID từ Employee
    // .toList();
    // if(!user.getTenant().getCode().equals(TenantContext.getCurrentTenant())) {
    // throw new
    // ApiException(ErrorMessage.EMPLOYEE_AND_USER_ARE_NOT_IN_THE_SAME_CLASS);
    // }
    // if(employeeCodes.contains(employeeCode)) {
    // throw new ApiException(ErrorMessage.EMPLOYEE_CODE_ALREADY_CREATED);
    // }
    // user.setEmployee(employee);
    // userRepository.save(user);
    // }
}

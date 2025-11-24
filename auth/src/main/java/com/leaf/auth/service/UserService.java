package com.leaf.auth.service;

import com.leaf.auth.domain.Role;
import com.leaf.auth.domain.User;
import com.leaf.auth.domain.UserPermission;
import com.leaf.auth.dto.ImportUserDTO;
import com.leaf.auth.dto.UserDTO;
import com.leaf.auth.dto.UserPermissionDTO;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.dto.excel.ExcelTemplateConfig;
import com.leaf.auth.dto.excel.ImportExcelResult;
import com.leaf.auth.dto.excel.ReadExcelResult;
import com.leaf.auth.dto.excel.RowData;
import com.leaf.auth.dto.excel.RowHeader;
import com.leaf.auth.dto.req.ChangePasswordReq;
import com.leaf.auth.dto.search.SearchRequest;
import com.leaf.auth.dto.search.SearchResponse;
import com.leaf.auth.enums.PermissionAction;
import com.leaf.auth.grpc.GrpcUserProfileClient;
import com.leaf.auth.repository.RoleRepository;
import com.leaf.auth.repository.UserPermissionRepository;
import com.leaf.auth.repository.UserRepository;
import com.leaf.auth.util.ExcelBuilder;
import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.common.security.AuthoritiesConstants;
import com.leaf.common.security.SecurityUtils;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.DateUtils;

import jakarta.persistence.criteria.Predicate;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final ValidatorFactory validator = Validation.buildDefaultValidatorFactory();
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final GrpcUserProfileClient userProfileClient;
    private final AuthService authService;
    private final KafkaTemplate<String, VerificationEmailEvent> kafkaTemplate;

    public UserDTO findById(Long id) {
        return userRepository.findById(id).map(UserDTO::fromEntity)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
    }

    public UserDTO createUser(UserDTO request, boolean isAdmin) {
        if (userRepository.existsUserByUsername(request.getUsername())) {
            throw new ApiException(ErrorMessage.USERNAME_ALREADY_EXITS);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(ErrorMessage.EMAIL_ALREADY_EXITS);
        }

        User user = User.builder()
                .username(request.getUsername())
                .activated(isAdmin ? request.isActivated() : false)
                .isGlobal(isAdmin ? request.getIsGlobal() : false)
                .isLocked(false)
                .email(request.getEmail())
                .fullName(request.getFullname())
                .build();

        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);
        if (ObjectUtils.isNotEmpty(request.getRoles()) && isAdmin) {
            user.setRoles(new HashSet<>(roleRepository.findAllByCodeIn(request.getRoles())));
        } else {
            user.setRoles(new HashSet<>(roleRepository.findAllByCodeIn(List.of("ROLE_USER"))));
        }
        User res = userRepository.save(user);
        if ((isAdmin && !request.isActivated()) || !isAdmin) {
            kafkaTemplate.send(EventConstants.verificationEmailTopic, VerificationEmailEvent.builder()
                    .to(request.getEmail())
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .build());
        } else if (isAdmin && request.isActivated()) {
            com.leaf.common.grpc.UserProfileDTO userProfileDTO = com.leaf.common.grpc.UserProfileDTO.newBuilder()
                    .setUserId(user.getUsername())
                    .build();
            userProfileClient.createUserProfile(userProfileDTO);
        }
        return UserDTO.fromEntity(res);
    }

    public UserDTO updateUser(UserDTO request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        User user = optionalUser.get();
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

    public void changeLockUser(Long id, boolean isLocked) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
        user.setLocked(isLocked);
        userRepository.save(user);
    }

    public VerifyEmailTokenDTO activeUserByUserName(VerifyEmailTokenDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
        user.setActivated(true);
        userRepository.save(user);

        com.leaf.common.grpc.UserProfileDTO userProfileDTO = com.leaf.common.grpc.UserProfileDTO.newBuilder()
                .setUserId(user.getUsername())
                .build();
        userProfileClient.createUserProfile(userProfileDTO);

        return VerifyEmailTokenDTO.newBuilder()
                .setUsername(user.getUsername())
                .setEmail(request.getEmail())
                .build();
    }

    public void changePassword(String cookieValue, ChangePasswordReq req, HttpServletResponse response) {
        if (CommonUtils.isEmpty(req.getCurrentPassword(), req.getNewPassword())) {
            throw new ApiException(ErrorMessage.VALIDATION_ERROR);
        }
        String userLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED));
        Optional<User> optionalUser = userRepository.findByUsername(userLogin);
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new ApiException(ErrorMessage.CURRENT_PASSWORD_INVALID);
        }
        if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
            throw new ApiException(ErrorMessage.PASSWORD_NEW_CANNOT_BE_SAME_AS_OLD);
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        authService.logout(cookieValue, req.getChannel(), response);
    }

    public void updateUserProfile(UserProfileDTO request) {
        String userLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED));
        Optional<User> optionalUser = userRepository.findByUsername(userLogin);
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        userRepository.save(optionalUser.get());
    }

    @Transactional(readOnly = true)
    public SearchResponse<UserDTO> searchDatatable(SearchRequest request) {
        Specification<User> spec = createSpecification(request);
        Page<User> tenants = userRepository.findAll(spec, request.toPageable());
        return new SearchResponse<>(
                tenants.getContent().stream().map(UserDTO::fromEntity).collect(Collectors.toList()),
                tenants.getTotalElements());
    }

    private Specification<User> createSpecification(SearchRequest criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.isNotBlank(criteria.searchText())) {
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("username")), "%" + criteria.searchText().toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("username")), "%" + criteria.searchText().toLowerCase() + "%")));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional(readOnly = true)
    public byte[] exportUser(SearchRequest request) {
        Specification<User> spec = createSpecification(request);
        List<User> data = userRepository.findAll(spec, Sort.by(Sort.Direction.ASC,
                "id"));
        List<String> headers = List.of("#", "Tên đăng nhập", "Email", "Trạng thái", "Ngày tạo");
        try (XSSFWorkbook wb = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Data");
            CellStyle headerStyle = ExcelBuilder.createHeaderStyle(wb);
            ExcelBuilder.createHeaderRow(sheet, headerStyle, headers);
            int r = 1;
            for (User item : data) {
                Row row = sheet.createRow(r);
                Cell stt = row.createCell(0);
                stt.setCellValue(r);
                stt.setCellStyle(headerStyle);

                row.createCell(1).setCellValue(item.getUsername());
                row.createCell(2).setCellValue(item.isActivated() ? "Hoạt động" : "Không hoạt động");
                row.createCell(3).setCellValue(DateUtils.dateToString(item.getCreatedDate()));
                r++;
            }
            IntStream.range(1, headers.size()).forEach(sheet::autoSizeColumn);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR, e.getMessage());
        }
    }

    public byte[] downloadTemplate() {
        List<String> roleCodes = roleRepository.findAll().stream()
                .map(Role::getCode)
                .filter(t -> !AuthoritiesConstants.SUPER_ADMIN.equalsIgnoreCase(t))
                .collect(Collectors.toList());
        ExcelTemplateConfig config = ExcelTemplateConfig.builder()
                .headers(List.of("Tên đăng nhập", "Email", "Vai trò"))
                .fieldRequired(List.of(1, 2, 3))
                .autoNumber(true)
                .listValidations(new ArrayList<>())
                .build();
        config.getListValidations().add(ExcelTemplateConfig.ExcelValidation.builder()
                .rangeName("_ROLE")
                .rowIndex(3)
                .data(roleCodes)
                .build());
        return ExcelBuilder.buildFileTemplate(config);
    }

    public ImportExcelResult<ImportUserDTO> importUser(MultipartFile file) {
        ImportExcelResult<ImportUserDTO> result = new ImportExcelResult<>();
        List<RowHeader> rowHeaders = List.of(
                new RowHeader("Tên đăng nhập", "username", 1),
                new RowHeader("Vai trò", "role", 2));
        ReadExcelResult mapData = ExcelBuilder.readFileExcel(file, rowHeaders);
        List<ImportUserDTO> fileData = mapData.getData().stream()
                .map(ImportUserDTO::fromExcelData)
                .toList();
        result.getHeaders().addAll(rowHeaders);
        List<String> usernames = fileData.stream()
                .map(ImportUserDTO::getUsername)
                .filter(StringUtils::isNotBlank).toList();
        List<String> existingData = userRepository.findUserExitsUsername(usernames);
        IntStream.range(0, fileData.size()).forEach(i -> {
            ImportUserDTO dto = fileData.get(i);
            RowData<ImportUserDTO> rowError = new RowData<>(dto);
            Set<ConstraintViolation<ImportUserDTO>> violations = validator.getValidator().validate(dto);
            for (var v : violations) {
                rowError.addFieldError(v.getPropertyPath().toString(), v.getMessage());
            }
            if (StringUtils.isNotBlank(dto.getUsername()) &&
                    existingData.contains(dto.getUsername())) {
                rowError.addFieldError("username", "Tên đăng nhập đã tồn tại.");
            }
            if (rowError.hasErrors()) {
                result.getRows().add(rowError);
            }
        });
        if (!result.isHasErrors()) {
            List<String> roleCodes = fileData.stream().map(ImportUserDTO::getRole).toList();
            List<Role> roleList = roleRepository.findAllByCodeIn(roleCodes);
            List<User> users = fileData.stream()
                    .map(dto -> dto.toEntity(
                            passwordEncoder.encode(dto.getPassword()),
                            roleList.stream()
                                    .filter(r -> r.getCode().equals(dto.getRole()))
                                    .collect(Collectors.toSet())))
                    .toList();
            userRepository.saveAll(users);
        }
        return result;
    }

    public Map<String, PermissionAction> getUserPermissions(Long userId) {
        List<UserPermission> data = userPermissionRepository.findAllByUserId(userId);
        return data.stream().collect(Collectors.toMap(UserPermission::getPermissionCode,
                UserPermission::getAction));
    }

    @Transactional
    public void updateUserPermission(Long userId, List<UserPermissionDTO> request) {
        userPermissionRepository.deleteAllByUserId(userId);
        userPermissionRepository.saveAll(request.stream()
                .map(item -> item.toEntity(userId))
                .collect(Collectors.toSet()));
    }
}
